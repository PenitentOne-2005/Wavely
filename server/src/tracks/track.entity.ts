import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'tracks' })
export class Track {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  jamendoId!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  artist!: string;

  @Column({ type: 'varchar', nullable: true })
  cover!: string | null;

  @Column({ type: 'int', default: 0 })
  duration!: number;

  @Column({ type: 'varchar' })
  audioUrl!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
