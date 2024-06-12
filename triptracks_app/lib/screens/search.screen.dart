import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
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
            child: Text("Search Screen 👀"),
          ),
        ),
      ),
    );
  }
}
