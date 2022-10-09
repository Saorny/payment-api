import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): any {
  const options = new DocumentBuilder()
    .setTitle('Payment Demo API')
    .setDescription('Payment Demo API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document);
  }
}
