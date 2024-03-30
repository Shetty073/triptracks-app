import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

Widget showSpinner({Color? color, double? size, String? type = "CubeGrid"}) {
  Color finalColor = color ?? Colors.deepPurple;
  double finalSize = size ?? 50.0;

  switch (type) {
    case "CubeGrid":
      return SpinKitCubeGrid(
        color: finalColor,
        size: finalSize,
      );

    case "Wave":
      return SpinKitWave(
        color: finalColor,
        size: finalSize,
      );

    default:
      return SpinKitCubeGrid(
        color: finalColor,
        size: finalSize,
      );
  }
}

class Spinner extends StatelessWidget {
  final Color? spinnerColor;
  final double? spinnerSize;
  final String? spinnerType;

  const Spinner({
    super.key,
    this.spinnerColor,
    this.spinnerSize,
    this.spinnerType,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: showSpinner(
        color: spinnerColor,
        size: spinnerSize,
        type: spinnerType,
      ),
    );
  }
}
