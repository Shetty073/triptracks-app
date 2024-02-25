import 'package:flutter/material.dart';

class PrimaryButton extends StatefulWidget {
  final String buttonText;
  final Function()? onPressed;

  const PrimaryButton({
    super.key,
    required this.buttonText,
    required this.onPressed,
  });

  @override
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: widget.onPressed,
      style: const ButtonStyle(
        minimumSize: MaterialStatePropertyAll(
          Size(100, 50),
        ),
      ),
      child: Text(
        widget.buttonText,
        style: const TextStyle(fontSize: 15),
      ),
    );
  }
}
