import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  static void handleOnLogin() {
    print("Login button pressed");
  }

  static void handleOnRegister() {
    print("Don't have account button pressed");
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Padding(
        padding: EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            TextField(
              keyboardType: TextInputType.emailAddress,
              maxLength: 512,
              decoration: InputDecoration(
                  border: OutlineInputBorder(), hintText: "Email"),
            ),
            TextField(
              keyboardType: TextInputType.visiblePassword,
              maxLength: 16,
              decoration: InputDecoration(
                  border: OutlineInputBorder(), hintText: "Password"),
            ),
            Padding(
              padding: EdgeInsets.all(10.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: handleOnLogin,
                    style: ButtonStyle(
                        minimumSize: MaterialStatePropertyAll(Size(100, 50))),
                    child: Text(
                      "Login",
                      style: TextStyle(fontSize: 15),
                    ),
                  ),
                  SizedBox(
                    height: 10.0,
                  ),
                  TextButton(
                    onPressed: handleOnRegister,
                    child: Text("Don't have an account?"),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
