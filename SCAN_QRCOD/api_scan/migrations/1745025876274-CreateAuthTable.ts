import { stringify } from 'querystring';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuthTable1713300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da tabela 'Auth'
    await queryRunner.createTable(
      new Table({
        name: 'auth',
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
            name: 'attempt_time',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
          name: 'token',
          type: 'char',
          length: '255'
          }
        ],
      })
    );

    await queryRunner.createForeignKey(
      'auth',
      new TableForeignKey({
        columnNames: ['id_user'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('auth');
    if (!table) return;
  
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('id_user') !== -1,
    );
  
    if (foreignKey) {
      await queryRunner.dropForeignKey('auth', foreignKey);
    }
  
    await queryRunner.dropTable('auth');
  }
  
}
