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
    colorText: Colors.white,
    backgroundGradient: isError
        ? const LinearGradient(
            colors: [
              Colors.deepOrange,
              Colors.deepOrangeAccent,
              Colors.red,
              Colors.redAccent,
            ],
          )
        : const LinearGradient(
            colors: [
              Colors.deepPurple,
              Colors.deepPurpleAccent,
            ],
          ),
    backgroundColor: isError
        ? Colors.deepOrange.withOpacity(0.8)
        : Colors.deepPurple.withOpacity(0.8),
  );
}
