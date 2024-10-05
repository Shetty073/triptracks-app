import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/common/utils.common.dart';
import 'package:triptracks_app/models/user.model.dart';
import 'package:triptracks_app/services/auth.service.dart';
import 'package:triptracks_app/widgets/inputs/primary_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/primary_text_button.widget.dart';
import 'package:triptracks_app/widgets/inputs/single_text_field.widget.dart';
import 'package:triptracks_app/widgets/loaders/spinner.widget.dart';
import 'package:triptracks_app/widgets/popups/pop_snack.widget.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController emailController;
  late TextEditingController otpController;
  late TextEditingController passwordController;
  late TextEditingController confirmPasswordController;
  late AuthService authService;
  bool _registerButtonEnabled = false;
  bool _isloading = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    firstNameController = TextEditingController();
    lastNameController = TextEditingController();
    emailController = TextEditingController();
    otpController = TextEditingController();
    passwordController = TextEditingController();
    confirmPasswordController = TextEditingController();
    authService = AuthService();
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
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
    if (_formKey.currentState!.validate()) {
      String firstName = firstNameController.text;
      String lastName = lastNameController.text;
      String email = emailController.text;
      String password = passwordController.text;
      String confirmPassword = confirmPasswordController.text;

      if (password == confirmPassword) {
        User user = User(firstName: firstName, lastName: lastName,
            email: email, password: password, confirmPassword: confirmPassword);
        Future<bool?> userRegistration = authService.register(user);

        userRegistration.then(
          (registered) => {
            if (registered == true)
              {
                Get.offNamed('/login'),

              }
            else
              {
                popSnack(
                  title: "Error registering the user",
                  message: "Something went wrong...",
                  isError: true,
                ),
                setState(() {
                  _isloading = false;
                }),

              },
          },
        );
      } else {
        popSnack(
          title: "Password Mismatch",
          message:
              "Passwords do not match please re-enter and confirm password",
          isError: true,
        );
      }
    }
  }

  void handleEditingConplete() {
    FocusManager.instance.primaryFocus?.nextFocus();
    if (_formKey.currentState!.validate()) {
      setState(() {
        _registerButtonEnabled = true;
      });
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
            child: Form(
              key: _formKey,
              child: _isloading
                  ? const Spinner()
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SingleTextField(
                          keyboardType: TextInputType.text,
                          editingController: firstNameController,
                          maxLength: 128,
                          hintText: "First Name",
                          textInputAction: TextInputAction.next,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.text,
                          editingController: lastNameController,
                          maxLength: 128,
                          hintText: "Last Name",
                          textInputAction: TextInputAction.next,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.emailAddress,
                          editingController: emailController,
                          maxLength: 512,
                          hintText: "Email",
                          validator: emailValidator,
                          textInputAction: TextInputAction.next,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.number,
                          editingController: otpController,
                          maxLength: 6,
                          hintText: "OTP",
                          textInputAction: TextInputAction.done,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.visiblePassword,
                          editingController: passwordController,
                          maxLength: 16,
                          hintText: "Password",
                          validator: passwordValidator,
                          textInputAction: TextInputAction.next,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.visiblePassword,
                          editingController: confirmPasswordController,
                          obscureText: true,
                          maxLength: 16,
                          hintText: "Confirm Password",
                          validator: passwordValidator,
                          onEditingComplete: handleEditingConplete,
                        ),
                        Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              PrimaryButton(
                                buttonText: "REGISTER",
                                onPressed: _registerButtonEnabled
                                    ? handleOnRegister
                                    : null,
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
          ),
        ),
      ),
    );
  }
}
