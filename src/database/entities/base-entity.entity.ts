import { Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @Index()
  @CreateDateColumn({
    type: 'datetime',
    nullable: true,
    comment: 'Creation Date',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
    comment: 'Latest update time',
  })
  updatedAt: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null,
  })
  deletedAt: Date | null;

  @Column({
    default: false,
  })
  isDeleted: boolean;
}
