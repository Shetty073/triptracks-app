import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(11.0, 0, 11.0, 0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: SizeConstants.logicalHeight,
            ),
            child: const Column(
              children: [
                Text("Home Screen"),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
