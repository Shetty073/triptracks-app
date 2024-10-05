import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:get/get.dart' as get_router;
import 'package:triptracks_app/common/enums.common.dart';
import 'package:triptracks_app/services/secure_storage.service.dart';

class NetworkHelper {
  final String baseUrl;
  late Dio _dio;

  NetworkHelper(this.baseUrl) {
    _dio = Dio(BaseOptions(baseUrl: baseUrl));

    // Add interceptor for network errors
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (DioException e, handler) {
        if (e.error is DioException && e.error is SocketException) {
          throw Exception('No network connection');
        } else {
          throw e;
        }
      },
    ));
  }

  Future<dynamic> request(
      String endpoint, HttpMethod method, dynamic data) async {
    try {
      late Response response;
      switch (method) {
        case HttpMethod.get:
          response = await _dio.get(endpoint);
          break;
        case HttpMethod.post:
          response = await _dio.post(endpoint, data: jsonEncode(data));
          break;
        case HttpMethod.put:
          response = await _dio.put(endpoint, data: jsonEncode(data));
          break;
        case HttpMethod.delete:
          response = await _dio.delete(endpoint);
          break;
      }

      if (response.statusCode! >= 200 && response.statusCode! < 300) {
        return response.data;
      } else if (response.statusCode == 400) {
        // TODO: Add handling of 400
        return response.data;
      } else if (response.statusCode == 401) {
        await SecureStorageService.instance.deleteKey('token');
        get_router.Get.offAllNamed("/login");
      } else {
        throw Exception(
            'Failed to make ${method.toString()} request: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        throw Exception('No internet connection or slow network');
      } else {
        throw Exception(
            'Failed to make ${method.toString()} request: ${e.message}');
      }
    } catch (e) {
      throw Exception('Failed to make ${method.toString()} request: $e');
    }
  }
}
