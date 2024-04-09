import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(11.0, 0, 11.0, 0),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: SizeConstants.logicalHeight,
          ),
          child: const Center(
            child: Text("Messages Screen 📨"),
          ),
        ),
      ),
    );
  }
}
