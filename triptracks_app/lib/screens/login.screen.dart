import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/widgets/inputs/primary_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/primary_text_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/single_text_field.widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  static void handleOnLogin() {
    Get.offNamed('/');
  }

  static void handleOnRegister() {
    Get.toNamed("/register");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(11.0, 0, 11.0, 0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: SizeConstants.logicalHeight,
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SingleTextField(
                  keyboardType: TextInputType.emailAddress,
                  maxLength: 512,
                  hintText: "Email",
                ),
                SingleTextField(
                  keyboardType: TextInputType.visiblePassword,
                  maxLength: 16,
                  hintText: "Password",
                ),
                Padding(
                  padding: EdgeInsets.all(10.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      PrimaryButton(
                        buttonText: "LOGIN",
                        onPressed: handleOnLogin,
                      ),
                      SizedBox(
                        height: 10.0,
                      ),
                      PrimaryTextButton(
                        buttonText: "Don't have an account?",
                        onPressed: handleOnRegister,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
