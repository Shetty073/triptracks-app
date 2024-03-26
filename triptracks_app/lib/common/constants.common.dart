import 'dart:ui';

import 'package:flutter/widgets.dart';

class RegexConstants {
  static const String emailPatternRegex =
      r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$";
  static const String emailDomainRegex =
      r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$";
  static const String passwordPatternRegex =
      r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$';
}

class ErrorMessageConstants {
  static const String emailInvalid = "Please enter a valid email address";
  static const String emailDomainInvalid =
      "Supported domains: gmail.com, outlook.com, yahoo.com, icloud.com, aol.com, protonmail.com, zoho.com, gmx.com, yandex.com, mail.com";
}

class UrlConstants {
  static const String backendBaseUrl = "https://jsonplaceholder.typicode.com";
}

class SizeConstants {
  // First get the FlutterView.
  static FlutterView view =
      WidgetsBinding.instance.platformDispatcher.views.first;

  // Dimensions in physical pixels (px)
  static Size size = view.physicalSize;
  static double width = size.width;
  static double height = size.height;

  // Dimensions in logical pixels (dp)
  static Size logicalSize = view.physicalSize / view.devicePixelRatio;
  static double logicalWidth = logicalSize.width;
  static double logicalHeight = logicalSize.height;
}
