import { stringify } from 'querystring';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLoginTable1713300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da tabela 'login'
    await queryRunner.createTable(
      new Table({
        name: 'login',
        columns: [
          {
            name: 'id',
              type: 'char',
              length: '36',
              isPrimary: true,
              default: '(UUID())',
          },
          {
            name: 'id_user',
              type: 'char',
              length: '36',
              isNullable: true,
          },
          {
            name: 'email',
              type: 'varchar',
              length: '255',
          },
          {
            name: 'password',
              type: 'varchar',
              length: '255',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'login',
      new TableForeignKey({
        columnNames: ['id_user'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('login');
    if (!table) return;
  
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('id_user') !== -1,
    );
  
    if (foreignKey) {
      await queryRunner.dropForeignKey('login', foreignKey);
    }
  
    await queryRunner.dropTable('login');
  }
  
}
