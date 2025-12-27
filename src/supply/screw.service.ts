import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Screw } from "./interface/screw.entity.js";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ScrewDTO } from "./dto/screw.dto.js";
import { ScrewUpdateDTO } from "./dto/screw-update.dto.js"; 


@Injectable()
export class ScrewService {

  constructor(
    @InjectRepository(Screw)
    private readonly screwService: EntityRepository<Screw>,
    private readonly em: EntityManager
  ){}

  async findAll(): Promise<Screw[]|null>{
    return await this.screwService.findAll()
  }

  async findOne(id: number): Promise<Screw | null>{
    return await this.screwService.findOneOrFail(id)
  }

  async create(screw: ScrewDTO): Promise<Screw>{
    const screwCreate = this.screwService.create(screw)
    await this.em.persistAndFlush(screwCreate)
    return screwCreate
  }
  
  async update(id: number, screw: ScrewUpdateDTO): Promise<Screw>{
    const screwUpdate = this.screwService.getReference(id)
    this.screwService.assign(screwUpdate, screw)
    await this.em.persistAndFlush(screwUpdate)
    return screwUpdate
  }
  
  async delete(id: number){
    const screw = this.screwService.getReference(id)
    if (screw.id){
      await this.em.removeAndFlush(screw)
      return 'screw delete succesfully'
    }
    throw new BadRequestException('screw not found')
  }
}