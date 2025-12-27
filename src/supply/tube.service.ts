import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Tube } from "./interface/tube.entity.js";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { TubeDTO } from "./dto/tube.dto.js";
import { TubeUpdateDTO } from "./dto/tube-update.dto.js";


@Injectable()
export class TubeService {

  constructor(
    @InjectRepository(Tube)
    private readonly tubeService: EntityRepository<Tube>,
    private readonly em: EntityManager
  ){}

  async findAll(): Promise<Tube[]|null>{
    return await this.tubeService.findAll()
  }

  async findOne(id: number): Promise<Tube | null>{
    return await this.tubeService.findOneOrFail(id)
  }

   async create(Tube: TubeDTO): Promise<Tube>{
      const tubeCreate = this.tubeService.create(Tube)
      await this.em.persistAndFlush(tubeCreate)
      return tubeCreate
    }
  
  async update(id: number, Tube: TubeUpdateDTO): Promise<Tube>{
      const TubeUpdate = this.tubeService.getReference(id)
      this.tubeService.assign(TubeUpdate, Tube)
      await this.em.persistAndFlush(TubeUpdate)
      return TubeUpdate
    }
  
  async delete(id: number){
    const tube = this.tubeService.getReference(id)
    if (tube.id){
      await this.em.removeAndFlush(tube)
      return 'Tube delete succesfully'
    }
    throw new BadRequestException('Tube not found')
  }
}