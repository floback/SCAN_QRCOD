import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateScanLogsTable1713300000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'scan_logs',
      columns: [
        {
          name: 'id',
          type: 'char',
          length: '36',
          isPrimary: true,
          default: '(UUID())',
        },
        {
          name: 'id_qrcode',
          type: 'char',
          length: '36',
          isNullable: true,
        },
        {
          name: 'ip',
          type: 'varchar',
        },
        {
          name: 'country',
          type: 'varchar',
        },
        {
          name: 'city',
          type: 'varchar',
        },
        {
          name: 'region',
          type: 'varchar',
        },
        {
          name: 'latitude',
          type: 'float',
        },
        {
          name: 'longitude',
          type: 'float',
        },
        {
          name: 'creation_date',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        
      ],
    }));

    await queryRunner.createForeignKey('scan_logs', new TableForeignKey({
      columnNames: ['id_qrcode'],
      referencedColumnNames: ['id'],
      referencedTableName: 'qrcode',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('scan_logs');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes('id_qrcode'));
      if (foreignKey) {
        await queryRunner.dropForeignKey('scan_logs', foreignKey);
      }
    }

    await queryRunner.dropTable('scan_logs');
  }
}
