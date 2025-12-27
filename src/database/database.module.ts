import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        driver: MySqlDriver, 
        clientUrl: cfg.get<string>('DB_URL'),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        registerRequestContext: true, 
        debug: cfg.get<string>('NODE_ENV') !== 'production',
        highlighter: new SqlHighlighter(),
        schemaGenerator: {
          disableForeignKeys: true,
          createForeignKeyConstraints: true,
          ignoreSchema: [],
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
