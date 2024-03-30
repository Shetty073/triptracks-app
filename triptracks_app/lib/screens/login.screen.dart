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

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late TextEditingController emailController;
  late TextEditingController passwordController;
  late AuthService authService;
  bool _loginButtonEnabled = false;
  bool _isloading = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
    passwordController = TextEditingController();
    authService = AuthService();
  }

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  void handleOnLogin() {
    if (_formKey.currentState!.validate()) {
      String email = emailController.text;
      String password = passwordController.text;

      setState(() {
        _isloading = true;
      });
      
      Future<User?> authUser = authService.login(email, password);
      authUser.then(
        (user) => {
          if (user != null)
            {
              popSnack(
                title: "Welcome ${user.name}",
              ),
              Get.offNamed('/'),
            }
          else
            {
              popSnack(
                title: "Error Logging In",
                message: "Something went wrong...",
                isError: true,
              ),
              setState(() {
                _isloading = false;
              }),
            },
        },
      );
    }
  }

  static void handleOnRegister() {
    Get.toNamed("/register");
  }

  void handleEditingConplete() {
    FocusManager.instance.primaryFocus?.nextFocus();
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loginButtonEnabled = true;
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
                          keyboardType: TextInputType.emailAddress,
                          editingController: emailController,
                          maxLength: 512,
                          hintText: "Email",
                          validator: emailValidator,
                          textInputAction: TextInputAction.next,
                          onEditingComplete: handleEditingConplete,
                        ),
                        SingleTextField(
                          keyboardType: TextInputType.visiblePassword,
                          editingController: passwordController,
                          obscureText: true,
                          maxLength: 16,
                          hintText: "Password",
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
                                buttonText: "LOGIN",
                                onPressed:
                                    _loginButtonEnabled ? handleOnLogin : null,
                              ),
                              const SizedBox(
                                height: 10.0,
                              ),
                              const PrimaryTextButton(
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
      ),
    );
  }
}
