import React, { useState, useEffect, useRef } from 'react';
import { formatDateToDDMMYYYYWithTime12 } from '../utils/dateUtils';
import '../styles/chatcomponent.css';

const Chat = ({
  title = "Chat",
  messages = [],
  onSendMessage = () => { },
  currentUser = null,
  height = '400px',
  showTypingIndicator = false,
  typingUsers = [],
  showOnlineUsers = false,
  onlineUsers = [],
  enableEmojiPicker = false,
  enableFileUpload = false,
  enableVoiceMessage = false,
  placeholder = "Type your message...",
  maxMessageLength = 500,
  className = "",
  disabled = false,
  showMessageStatus = false,
  allowEdit = false,
  allowDelete = false,
  onEditMessage = () => { },
  onDeleteMessage = () => { },
  theme = 'light',
  showTimestamp = true,
  groupMessages = true,
  showUserAvatar = true,
  customEmojis = [],
  autoScroll = true,
  soundEnabled = true,
  mentionEnabled = false,
  users = [],
  onUserMention = () => { },
  showMessageReactions = false,
  onReactToMessage = () => { },
  reactions = ['👍', '❤️', '😂', '😢', '😡'],
  messageActions = [],
  showSearchBar = false,
  onSearchMessages = () => { },
  searchQuery = "",
  highlightSearchResults = true
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Default emojis
  const defaultEmojis = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😴', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🚀', '⭐'];
  const allEmojis = [...defaultEmojis, ...customEmojis];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  // Update search term when prop changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(recordingIntervalRef.current);
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && !disabled) {
      const messageData = {
        text: newMessage.trim(),
        file: selectedFile,
        timestamp: new Date().toISOString(),
        type: selectedFile ? 'file' : 'text'
      };
      onSendMessage(messageData);
      setNewMessage('');
      setSelectedFile(null);
      setShowEmojiPicker(false);
    }
  };

  const handleEditMessage = (messageId, newText) => {
    if (allowEdit) {
      onEditMessage(messageId, newText);
      setEditingMessageId(null);
      setEditingText('');
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (allowDelete && window.confirm('Are you sure you want to delete this message?')) {
      onDeleteMessage(messageId);
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleUserMention = (username) => {
    if (mentionEnabled) {
      setNewMessage(prev => prev + `@${username} `);
      onUserMention(username);
      messageInputRef.current?.focus();
    }
  };

  const handleReaction = (messageId, reaction) => {
    if (showMessageReactions) {
      onReactToMessage(messageId, reaction);
    }
  };

  const formatTime = (timestamp) => {
    if (!showTimestamp) return '';
    return formatDateToDDMMYYYYWithTime12(timestamp);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const highlightText = (text, query) => {
    if (!highlightSearchResults || !query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const filteredMessages = messages.filter(msg =>
    !searchTerm || msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedMessages = groupMessages
    ? filteredMessages.reduce((groups, message, index) => {
      const prevMessage = filteredMessages[index - 1];
      const shouldGroup = prevMessage &&
        prevMessage.sender === message.sender &&
        new Date(message.timestamp) - new Date(prevMessage.timestamp) < 300000; // 5 minutes

      if (shouldGroup) {
        groups[groups.length - 1].messages.push(message);
      } else {
        groups.push({
          sender: message.sender,
          isCurrentUser: message.isCurrentUser,
          avatar: message.avatar,
          messages: [message]
        });
      }
      return groups;
    }, [])
    : filteredMessages.map(msg => ({
      sender: msg.sender,
      isCurrentUser: msg.isCurrentUser,
      avatar: msg.avatar,
      messages: [msg]
    }));

  return (
    <div className={`chat-component ${theme} ${className}`}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="chat-title mb-0">
            <i className="bx bx-chat me-2"></i>
            {title}
          </h5>
          <div className="chat-actions d-flex gap-2">
            {showSearchBar && (
              <div className="search-container">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onSearchMessages(e.target.value);
                  }}
                />
                <i className="bx bx-search search-icon"></i>
              </div>
            )}
            {showOnlineUsers && (
              <div className="online-users">
                <span className="online-count">{onlineUsers.length} online</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Online Users List */}
      {showOnlineUsers && (
        <div className="online-users-list">
          <div className="d-flex flex-wrap gap-2 p-2">
            {onlineUsers.map((user, index) => (
              <div key={index} className="online-user">
                <div className="user-avatar-small">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="online-indicator"></span>
                </div>
                <span className="user-name">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className="chat-messages"
        style={{ height }}
        ref={chatContainerRef}
      >
        {groupedMessages.length === 0 ? (
          <div className="no-messages">
            <i className="bx bx-chat display-4 text-muted"></i>
            <p className="text-muted mt-2">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className={`message-group ${group.isCurrentUser ? 'current-user' : 'other-user'}`}>
              <div className="message-group-header">
                {showUserAvatar && !group.isCurrentUser && (
                  <div className="user-avatar">
                    {group.avatar ? (
                      <img src={group.avatar} alt={group.sender} />
                    ) : (
                      <div className="avatar-placeholder">
                        {group.sender.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className="message-group-content">
                  {!group.isCurrentUser && (
                    <div className="sender-name" onClick={() => handleUserMention(group.sender)}>
                      {group.sender}
                    </div>
                  )}
                  <div className="messages-list">
                    {group.messages.map((msg, msgIndex) => (
                      <div key={msg.id} className={`message-bubble ${msg.status || ''}`}>
                        <div className="message-content">
                          {editingMessageId === msg.id ? (
                            <div className="edit-message-form">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditMessage(msg.id, editingText);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingMessageId(null);
                                    setEditingText('');
                                  }
                                }}
                                autoFocus
                              />
                              <div className="edit-actions">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEditMessage(msg.id, editingText)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => {
                                    setEditingMessageId(null);
                                    setEditingText('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.type === 'file' && msg.file && (
                                <div className="message-file">
                                  <i className="bx bx-file me-2"></i>
                                  <span>{msg.file.name}</span>
                                </div>
                              )}
                              <div
                                className="message-text"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(msg.message, searchTerm)
                                }}
                              />
                              {showTimestamp && (
                                <div className="message-timestamp">
                                  {formatTime(msg.timestamp)}
                                  {showMessageStatus && msg.status && (
                                    <span className={`message-status ${msg.status}`}>
                                      <i className={`bx ${msg.status === 'sent' ? 'bx-check' :
                                        msg.status === 'delivered' ? 'bx-check-double' :
                                          msg.status === 'read' ? 'bx-check-double text-primary' :
                                            'bx-time'
                                        }`}></i>
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className="message-actions">
                          {showMessageReactions && (
                            <div className="message-reactions">
                              <div className="reaction-picker">
                                {reactions.map((reaction, index) => (
                                  <button
                                    key={index}
                                    className="reaction-btn"
                                    onClick={() => handleReaction(msg.id, reaction)}
                                  >
                                    {reaction}
                                  </button>
                                ))}
                              </div>
                              {msg.reactions && (
                                <div className="active-reactions">
                                  {Object.entries(msg.reactions).map(([reaction, count]) => (
                                    <span key={reaction} className="reaction-count">
                                      {reaction} {count}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {(allowEdit || allowDelete || messageActions.length > 0) && group.isCurrentUser && (
                            <div className="message-menu">
                              <button className="btn btn-sm btn-link message-menu-btn">
                                <i className="bx bx-dots-horizontal-rounded"></i>
                              </button>
                              <div className="message-menu-dropdown">
                                {allowEdit && (
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      setEditingMessageId(msg.id);
                                      setEditingText(msg.message);
                                    }}
                                  >
                                    <i className="bx bx-edit me-2"></i>Edit
                                  </button>
                                )}
                                {allowDelete && (
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                  >
                                    <i className="bx bx-trash me-2"></i>Delete
                                  </button>
                                )}
                                {messageActions.map((action, index) => (
                                  <button
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => action.onClick(msg)}
                                  >
                                    {action.icon && <i className={`${action.icon} me-2`}></i>}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {showTypingIndicator && typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-avatar">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <span className="typing-text">
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.length} people are typing...`
              }
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input">
        {selectedFile && (
          <div className="selected-file">
            <div className="file-preview">
              <i className="bx bx-file me-2"></i>
              <span>{selectedFile.name}</span>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={() => setSelectedFile(null)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-group">
            {/* File Upload */}
            {enableFileUpload && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <i className="bx bx-paperclip"></i>
              </button>
            )}

            {/* Voice Message */}
            {enableVoiceMessage && (
              <button
                type="button"
                className={`btn ${isRecording ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
              >
                <i className={`bx ${isRecording ? 'bx-stop' : 'bx-microphone'}`}></i>
                {isRecording && <span className="recording-time">{formatRecordingTime(recordingTime)}</span>}
              </button>
            )}

            {/* Message Input */}
            <input
              ref={messageInputRef}
              type="text"
              className="form-control"
              placeholder={isRecording ? 'Recording...' : placeholder}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxMessageLength}
              disabled={disabled || isRecording}
            />

            {/* Emoji Picker */}
            {enableEmojiPicker && (
              <div className="emoji-picker-container">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={disabled}
                >
                  <i className="bx bx-smile"></i>
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-grid">
                      {allEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          className="emoji-btn"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={disabled || (!newMessage.trim() && !selectedFile)}
            >
              <i className="bx bx-send"></i>
            </button>
          </div>
        </form>

        {/* Character Count */}
        {maxMessageLength && (
          <div className="character-count">
            <small className="text-muted">
              {newMessage.length}/{maxMessageLength}
            </small>
          </div>
        )}

        {/* Hidden File Input */}
        {enableFileUpload && (
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
