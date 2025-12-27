import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Elbow } from "./interface/elbow.entity.js";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ElbowDTO } from "./dto/elbow.dto.js";
import { ElbowUpdateDTO } from "./dto/elbow-update.dto.js"


@Injectable()
export class ElbowService {

  constructor(
    @InjectRepository(Elbow)
    private readonly elbowService: EntityRepository<Elbow>,
    private readonly em: EntityManager
  ){}

  async findAll(): Promise<Elbow[]|null>{
    return await this.elbowService.findAll()
  }

  async findOne(id: number): Promise<Elbow | null>{
    return await this.elbowService.findOneOrFail(id)
  }

   async create(elbow: ElbowDTO): Promise<Elbow>{
      const elbowCreate = this.elbowService.create(elbow)
      await this.em.persistAndFlush(elbowCreate)
      return elbowCreate
    }
  
    async update(id: number, elbow: ElbowUpdateDTO): Promise<Elbow>{
      const elbowUpdate = this.elbowService.getReference(id)
      this.elbowService.assign(elbowUpdate, elbow)
      await this.em.persistAndFlush(elbowUpdate)
      return elbowUpdate
    }
  
    async delete(id: number){
      const elbow = this.elbowService.getReference(id)
      if (elbow.id){
        await this.em.removeAndFlush(elbow)
        return 'elbow delete succesfully'
      }
      throw new BadRequestException('elbow not found')
  
    }

}