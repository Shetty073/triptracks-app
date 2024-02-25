import 'package:flutter/material.dart';

class PrimaryTextButton extends StatefulWidget {
  final String buttonText;
  final Function()? onPressed;

  const PrimaryTextButton({
    super.key,
    required this.buttonText,
    required this.onPressed,
  });

  @override
  State<PrimaryTextButton> createState() => _PrimaryTextButtonState();
}

class _PrimaryTextButtonState extends State<PrimaryTextButton> {
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: widget.onPressed,
      child: Text(
        widget.buttonText,
      ),
    );
  }
}
