import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfileQuiz1761468730189 implements MigrationInterface {
  name = 'CreateProfileQuiz1761468730189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`profile_quiz\` (\`id\` int NOT NULL AUTO_INCREMENT, \`servant_id\` int NOT NULL, \`raw_profile\` text NOT NULL, \`masked_profile\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`profile_quiz\``);
  }
}
