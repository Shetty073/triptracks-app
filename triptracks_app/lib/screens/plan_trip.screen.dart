import 'package:flutter/material.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/screens/feed.screen.dart';
import 'package:triptracks_app/screens/messages.screen.dart';
import 'package:triptracks_app/screens/profile.screen.dart';
import 'package:triptracks_app/screens/search.screen.dart';
import 'package:triptracks_app/widgets/popups/pop_snack.widget.dart';

class PlanTripScreen extends StatefulWidget {
  const PlanTripScreen({super.key});

  @override
  State<PlanTripScreen> createState() => _PlanTripScreenState();
}

class _PlanTripScreenState extends State<PlanTripScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Hero(
              tag: "fab_to_plan_trip",
              child: Text(""),
            ),
            Text("Plan a new trip"),
          ],
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(11.0, 0, 11.0, 0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: SizeConstants.logicalHeight,
            ),
            child: const Center(
              child: Text("Start Planning 🛣️"),
            ),
          ),
        ),
      ),
    );
  }
}
