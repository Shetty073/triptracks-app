import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/common/utils.common.dart';
import 'package:triptracks_app/models/user.model.dart';
import 'package:triptracks_app/services/auth.service.dart';
import 'package:triptracks_app/widgets/inputs/primary_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/primary_text_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/single_text_field.widget.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late TextEditingController nameController;
  late TextEditingController emailController;
  late TextEditingController otpController;
  late TextEditingController passwordController;
  late TextEditingController confirmPasswordController;
  late AuthService authService;
  bool _registerButtonEnabled = false;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    emailController = TextEditingController();
    otpController = TextEditingController();
    passwordController = TextEditingController();
    confirmPasswordController = TextEditingController();
    authService = AuthService();
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    otpController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  static void handleOnLogin() {
    Get.offNamed('/login');
  }

  void handleOnRegister() {
    String name = nameController.text;
    String email = emailController.text;
    String password = passwordController.text;
    String confirmPassword = confirmPasswordController.text;

    if (password == confirmPassword) {
      User user = User(name: name, email: email, password: password);
      User? rUser = authService.register(user);
      if (rUser != null) {
        Get.offNamed('/');
      }
    }
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
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SingleTextField(
                keyboardType: TextInputType.text,
                maxLength: 128,
                hintText: "Name",
                validator: emailValidator,
                editingController: nameController,
              ),
              SingleTextField(
                keyboardType: TextInputType.emailAddress,
                maxLength: 512,
                hintText: "Email",
                validator: emailValidator,
                editingController: emailController,
              ),
              SingleTextField(
                keyboardType: TextInputType.number,
                maxLength: 6,
                hintText: "OTP",
                editingController: otpController,
              ),
              SingleTextField(
                keyboardType: TextInputType.visiblePassword,
                maxLength: 16,
                hintText: "Password",
                editingController: passwordController,
                validator: passwordValidator,
              ),
              SingleTextField(
                keyboardType: TextInputType.visiblePassword,
                maxLength: 16,
                hintText: "Confirm Password",
                editingController: confirmPasswordController,
                validator: passwordValidator,
              ),
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    PrimaryButton(
                      buttonText: "REGISTER",
                      onPressed:
                          _registerButtonEnabled ? handleOnRegister : null,
                    ),
                    const SizedBox(
                      height: 10.0,
                    ),
                    const PrimaryTextButton(
                      buttonText: "Already have an account?",
                      onPressed: handleOnLogin,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      )),
    );
  }
}
