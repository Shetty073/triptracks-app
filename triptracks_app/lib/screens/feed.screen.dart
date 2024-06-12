import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';

class HomeFeedScreen extends StatefulWidget {
  const HomeFeedScreen({super.key});

  @override
  State<HomeFeedScreen> createState() => _HomeFeedScreenState();
}

class _HomeFeedScreenState extends State<HomeFeedScreen> {
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
            child: Text("Feed Screen 🖼️"),
          ),
        ),
      ),
    );
  }
}
