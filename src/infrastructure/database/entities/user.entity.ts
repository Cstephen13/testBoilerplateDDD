import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true, name: 'first_name' })
  firstName: string;

  @Column({ default: true, name: 'last_name' })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: false, name: 'password_encrypted' })
  passwordEncrypted: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
