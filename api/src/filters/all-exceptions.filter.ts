import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;

    const status =
      isHttpException
        ? (exception as HttpException).getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      isHttpException
        ? (exception as HttpException).message
        : "Houve um erro no servidor";

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}