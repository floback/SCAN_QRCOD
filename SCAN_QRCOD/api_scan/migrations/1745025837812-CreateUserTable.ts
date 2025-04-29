import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1713300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            default: '(UUID())',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'email',
          type: 'varchar',
          length: '255',
          isUnique: true,
        },
        {
          name: 'password',
          type: 'varchar',
          length: '255',
        },
        {
        name: 'type_user',
        type: 'enum',
        enum: ['owner', 'admin', 'user'],
        default: `'user'`,
        },
        {
          name: 'status',
            type: 'boolean',
            default: true,
        },
        {
          name: 'creation_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'update_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',

        }
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
