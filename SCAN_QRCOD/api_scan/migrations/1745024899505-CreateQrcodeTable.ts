import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateQrcodeTable1713300000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'qrcode',
      columns: [
        {
          name: 'id',
          type: 'char',
          length: '36',
          isPrimary: true,
          default: '(UUID())',
        },
        {
          name: 'code',
          type: 'varchar',
        },
        {
          name: 'id_user',
          type: 'char',
          length: '36',
          isNullable: true,
        },
        {
          name: 'img',
          type: 'text',
        },
        {
          name: 'creation_date',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'link_add',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'number_fone',
          type: 'varchar',
          length: '20',
        },        
        {
          name: 'status',
          type: 'boolean'
        }
      ],
    }));

    // Criando a chave estrangeira para o campo id_user, associando ao id da tabela users
    await queryRunner.createForeignKey('qrcode', new TableForeignKey({
      columnNames: ['id_user'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('qrcode');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes('id_user'));
      if (foreignKey) {
        await queryRunner.dropForeignKey('qrcode', foreignKey);
      }
    }

    await queryRunner.dropTable('qrcode');
  }
}
