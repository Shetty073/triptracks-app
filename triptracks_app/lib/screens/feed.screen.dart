import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class HomeFeedScreen extends StatefulWidget {
  final Function({bool showFullFab}) updateFabStatusInParent;

  const HomeFeedScreen({super.key, required this.updateFabStatusInParent});

  @override
  State<HomeFeedScreen> createState() => _HomeFeedScreenState();
}

class _HomeFeedScreenState extends State<HomeFeedScreen> {
  late ScrollController _scrollController;
  final GlobalKey<AnimatedListState> _listKey = GlobalKey<AnimatedListState>();
  bool _isLoading = false;
  bool _hasMore = true;
  List<String> _items = [];
  int _totalItems = 0; // Total items to be displayed
  int _currentPage = 1;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_scrollListener);
    _fetchData();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent &&
        !_isLoading) {
      _fetchData(); // Fetch more data when scrolled to the bottom
    }

    // Hide and show FAB based on scroll direction
    if (_scrollController.position.userScrollDirection ==
            ScrollDirection.reverse &&
        _scrollController.offset > 50.0) {
      widget.updateFabStatusInParent(showFullFab: false);
    } else if (_scrollController.position.userScrollDirection ==
        ScrollDirection.forward) {
      widget.updateFabStatusInParent(showFullFab: true);
    }
  }

  @override
  void dispose() {
    // Dispose of the scroll controller when the screen is disposed
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    if (_isLoading || !_hasMore) return; // Prevent multiple requests

    setState(() {
      _isLoading = true;
    });

    // Simulate fetching paginated data from the API
    await Future.delayed(const Duration(seconds: 1));

    // Assuming you want to add 10 items at a time
    int fetchedItemsCount = 10;
    _totalItems += fetchedItemsCount;

    // Insert fetched items into the list
    for (int index = 0; index < fetchedItemsCount; index++) {
      // Delay for staggered effect
      await Future.delayed(const Duration(milliseconds: 100));

      // Add item to list
      _items.add('Feed Item #${_items.length + 1}');
    }

    // Insert items into the AnimatedList after updating _items
    for (int index = _items.length - fetchedItemsCount;
        index < _items.length;
        index++) {
      _listKey.currentState
          ?.insertItem(index + 1); // +1 to account for hardcoded item
    }

    // Check if there are more items
    if (_totalItems >= 50) {
      _hasMore = false;
    } else {
      _currentPage++;
    }

    setState(() {
      _isLoading = false;
    });
  }

  void _removeItem(int index) {
    String removedItem = _items[index];
    _items.removeAt(index);
    _listKey.currentState!.removeItem(
      index + 1, // +1 to account for hardcoded item
      (context, animation) {
        return _buildItem(removedItem, animation);
      },
    );
  }

  Widget _buildItem(String item, Animation<double> animation) {
    final slideAnimation = Tween<Offset>(
      begin: const Offset(0, 1), // Start off the screen from the bottom
      end: Offset.zero, // End at the original position
    ).animate(animation);

    return SlideTransition(
      position: slideAnimation,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(item),
        ),
      ),
    );
  }

  Widget _buildHardcodedItem() {
    return const Padding(
      padding: EdgeInsets.all(16.0), // Add padding for the title
      child: Text(
        "Your Planned Trips",
        style: TextStyle(
          fontSize: 35, // You can adjust the font size
          fontWeight: FontWeight.bold, // Make it bold
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: AnimatedList(
          key: _listKey,
          initialItemCount: _items.length + 1, // Add 1 for hardcoded item
          controller: _scrollController,
          itemBuilder: (context, index, animation) {
            if (index == 0) {
              return _buildHardcodedItem(); // Return hardcoded widget for the first item
            }
            return _buildItem(
                _items[index - 1], animation); // Adjust index for list items
          },
        ),
      ),
    );
  }
}
