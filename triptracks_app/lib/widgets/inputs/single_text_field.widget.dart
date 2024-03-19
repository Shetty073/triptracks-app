import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SingleTextField extends StatefulWidget {
  final bool enabled;
  final bool readOnly;
  final TextInputType keyboardType;
  final TextInputAction? textInputAction;
  final bool obscureText;
  final String obscuringCharacter;
  final String hintText;
  final String? labelText;
  final int maxLength;
  final int maxLines;
  final List<TextInputFormatter>? inputFormatters;
  final TextEditingController? editingController;
  final Function(String)? onChanged;
  final Function(PointerDownEvent)? onTapOutside;
  final String? Function(String?)? validator;
  final Function()? onEditingComplete;

  const SingleTextField({
    super.key,
    this.enabled = true,
    this.readOnly = false,
    this.keyboardType = TextInputType.text,
    this.textInputAction = TextInputAction.done,
    this.obscureText = false,
    this.obscuringCharacter = '*',
    required this.hintText,
    this.labelText,
    this.maxLength = 256,
    this.maxLines = 1,
    this.inputFormatters,
    this.editingController,
    this.onChanged,
    this.onTapOutside,
    this.validator,
    this.onEditingComplete,
  });

  @override
  State<SingleTextField> createState() => _SingleTextFieldState();
}

class _SingleTextFieldState extends State<SingleTextField> {
  @override
  Widget build(BuildContext context) {
    return TextFormField(
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      obscureText: widget.obscureText,
      obscuringCharacter: widget.obscuringCharacter,
      maxLength: widget.maxLength,
      maxLines: widget.maxLines,
      inputFormatters: widget.inputFormatters,
      controller: widget.editingController,
      onChanged: widget.onChanged,
      onTapOutside: widget.onTapOutside,
      validator: widget.validator,
      onEditingComplete: widget.onEditingComplete,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      decoration: InputDecoration(
        errorMaxLines: 2,
        border: const OutlineInputBorder(),
        hintText: widget.hintText,
        labelText: widget.labelText ?? widget.hintText,
      ),
    );
  }
}
