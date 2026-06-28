import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../auth';
import { Track } from '../tracks';

@Entity({ name: 'playlists' })
export class Playlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: number;

  @ManyToMany(() => Track, { cascade: true, eager: true })
  @JoinTable()
  tracks!: Track[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
