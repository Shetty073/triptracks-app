import 'package:flutter/material.dart';

class SingleTextField extends StatefulWidget {
  final TextInputType keyboardType;
  final String hintText;
  final int maxLength;

  const SingleTextField({
    super.key,
    this.keyboardType = TextInputType.text,
    required this.hintText,
    this.maxLength = 256,
  });

  @override
  State<SingleTextField> createState() => _SingleTextFieldState();
}

class _SingleTextFieldState extends State<SingleTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      keyboardType: widget.keyboardType,
      maxLength: widget.maxLength,
      decoration: InputDecoration(
        border: const OutlineInputBorder(),
        hintText: widget.hintText,
      ),
    );
  }
}
