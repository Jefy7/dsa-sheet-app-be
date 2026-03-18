import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DifficultyEnum } from '../enums/DifficultyEnum';
import { Topic } from './Topic';
import { UserProgress } from './UserProgress';

@Entity('problems')
@Index('idx_problem_topic_id', ['topicId'])
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 250 })
  title!: string;

  @Column({
    type: 'enum',
    enum: DifficultyEnum,
  })
  difficulty!: DifficultyEnum;

  @Column({ type: 'varchar', nullable: true })
  youtubeLink?: string;

  @Column({ type: 'varchar', nullable: true })
  leetcodeLink?: string;

  @Column({ type: 'varchar', nullable: true })
  codeforcesLink?: string;

  @Column({ type: 'varchar', nullable: true })
  articleLink?: string;

  @Column({ type: 'int', default: 0 })
  orderIndex!: number;

  @Column({ type: 'uuid' })
  topicId!: string;

  @ManyToOne(() => Topic, (topic) => topic.problems, { onDelete: 'CASCADE' })
  topic!: Topic;

  @OneToMany(() => UserProgress, (progress) => progress.problem)
  progressEntries!: UserProgress[];
}
