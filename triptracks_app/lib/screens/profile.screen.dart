import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
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
            child: Text("Profile Screen 🧔‍♂️"),
          ),
        ),
      ),
    );
  }
}
