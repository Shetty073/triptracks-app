import 'package:flutter/material.dart';
import 'package:get/get.dart';

SnackbarController popSnack({
  String title = "Something is fishy",
  message = "",
  SnackPosition snackPosition = SnackPosition.BOTTOM,
  bool isError = false,
}) {
  return Get.snackbar(
    title,
    message,
    snackPosition: snackPosition,
    colorText: isError ? Colors.red : Colors.black,
    backgroundGradient: const LinearGradient(
      colors: [
        Colors.deepPurple,
        Colors.deepPurpleAccent,
      ],
    ),
  );
}
