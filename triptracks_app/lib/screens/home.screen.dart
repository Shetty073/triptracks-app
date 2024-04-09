import 'package:flutter/material.dart';
import 'package:triptracks_app/screens/feed.screen.dart';
import 'package:triptracks_app/screens/messages.screen.dart';
import 'package:triptracks_app/screens/profile.screen.dart';
import 'package:triptracks_app/screens/search.screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentPageIndex = 0;
  bool _isThereSearchNotifications = false;
  bool _isThereMessages = true;
  bool _isThereProfileNotifications = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: [
        const HomeFeedScreen(),
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
    );
  }
}
