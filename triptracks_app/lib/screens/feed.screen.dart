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

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();

    // Add a listener to the scroll controller
    _scrollController.addListener(() {
      print(_scrollController.offset);
      print(_scrollController.position.userScrollDirection);
      // Check if the user is scrolling down, hide the FAB
      if (_scrollController.position.userScrollDirection ==
              ScrollDirection.reverse &&
          _scrollController.offset > 50.0) {
        widget.updateFabStatusInParent(showFullFab: false);
      }
      // If the user scrolls up, show the FAB again
      else if (_scrollController.position.userScrollDirection ==
          ScrollDirection.forward) {
        widget.updateFabStatusInParent(showFullFab: true);
      }
    });
  }

  @override
  void dispose() {
    // Dispose of the scroll controller when the screen is disposed
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView.builder(
        controller: _scrollController,
        itemCount: 50, // Example: total number of items in the list
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text('Feed Item #${index + 1}'),
            ),
          );
        },
      ),
    );
  }
}
