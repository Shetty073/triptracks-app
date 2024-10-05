import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:triptracks_app/screens/feed.screen.dart';
import 'package:triptracks_app/screens/messages.screen.dart';
import 'package:triptracks_app/screens/profile.screen.dart';
import 'package:triptracks_app/screens/search.screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  int _currentPageIndex = 0;
  bool _isThereSearchNotifications = false;
  bool _isThereMessages = true;
  bool _isThereProfileNotifications = true;
  bool _showFullFab = true;

  void updateFabStatusInParent({bool showFullFab = true}) {
    setState(() {
      _showFullFab = showFullFab;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: [
        HomeFeedScreen(
          updateFabStatusInParent: updateFabStatusInParent,
        ),
        const SearchScreen(),
        const MessagesScreen(),
        const ProfileScreen(),
      ][_currentPageIndex],
      bottomNavigationBar: NavigationBar(
        destinations: [
          const NavigationDestination(
            selectedIcon: Icon(Icons.feed),
            icon: Icon(Icons.feed_outlined),
            label: 'Feed',
          ),
          NavigationDestination(
            selectedIcon: const Icon(Icons.search),
            icon: Badge(
              isLabelVisible: _isThereSearchNotifications,
              child: const Icon(Icons.search_outlined),
            ),
            label: 'Search',
          ),
          NavigationDestination(
            selectedIcon: const Icon(Icons.message),
            icon: Badge(
              label: const Text('2'),
              isLabelVisible: _isThereMessages,
              child: const Icon(Icons.messenger_outline),
            ),
            label: 'Messages',
          ),
          NavigationDestination(
            selectedIcon: const Icon(Icons.account_circle),
            icon: Badge(
              isLabelVisible: _isThereProfileNotifications,
              child: const Icon(Icons.account_circle_outlined),
            ),
            label: 'My Account',
          ),
        ],
        selectedIndex: _currentPageIndex,
        onDestinationSelected: (index) => {
          setState(() {
            _currentPageIndex = index;
          }),
        },
      ),
      floatingActionButton: (_currentPageIndex == 0)
          ? AnimatedSize(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              child: FloatingActionButton.extended(
                heroTag: "fab_to_plan_trip",
                label: _showFullFab
                    ? const Text("Plan a trip")
                    : const SizedBox.shrink(),
                icon: const Icon(Icons.add_road),
                enableFeedback: true,
                onPressed: () => {Get.toNamed("/plan_trip")},
              ),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}
