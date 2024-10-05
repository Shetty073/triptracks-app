import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {

  SecureStorageService._privateConstructor();

  static final SecureStorageService _instance = SecureStorageService._privateConstructor();

  static SecureStorageService get instance => _instance;

  final FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: _getAndroidOptions(),
  );

  static AndroidOptions _getAndroidOptions() => const AndroidOptions(
    encryptedSharedPreferences: true,
  );

  Future<void> saveKey(String key, String value) async {
    try {
      await _secureStorage.write(key: key, value: value);
    } catch (e) {
      print("Error saving key: $e");
    }
  }

  Future<String?> getKey(String key) async {
    try {
      return await _secureStorage.read(key: key);
    } catch (e) {
      print("Error retrieving key: $e");
      return null;
    }
  }

  Future<void> deleteKey(String key) async {
    try {
      await _secureStorage.delete(key: key);
    } catch (e) {
      print("Error deleting key: $e");
    }
  }

  Future<void> deleteAll() async {
    try {
      await _secureStorage.deleteAll();
    } catch (e) {
      print("Error deleting all keys: $e");
    }
  }
}
