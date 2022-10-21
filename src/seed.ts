import { NestExpressApplication } from '@nestjs/platform-express';
import { Seeder } from './modules/common/seeder.service';
import { ProductSeederService } from './seeder/product/product-seeder.service';

export async function seed(app: NestExpressApplication): Promise<void> {
  await seedForService(app, ProductSeederService);
}

function seedForService(app: NestExpressApplication, service: any): any {
  const seeder = app.get(service) as Seeder<any>;

  return seeder.seed();
}
