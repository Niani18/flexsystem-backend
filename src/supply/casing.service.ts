import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Casing } from "./interface/casing.entity.js";
import { CasingDTO } from "./dto/casing.dto.js";
import { CasingUpdateDTO } from "./dto/casing-update.dto.js"

@Injectable()
export class CasingService {

    constructor(
        @InjectRepository(Casing)
        private readonly casingRepository : EntityRepository<Casing>,
        private readonly em : EntityManager
    ){}

    async findAll() : Promise<Casing[]> {
        return this.casingRepository.findAll();
    }

    async findById(id : number) : Promise<Casing | null> {
        return this.casingRepository.findOneOrFail({ id });
    }

    async create(dto : CasingDTO) : Promise<Casing> {
        const casing = this.casingRepository.create(dto);
        await this.em.persistAndFlush(casing);
        return casing;
    }

    async update(id: number, dto : CasingUpdateDTO) : Promise<Casing | null> {
         const casing = await this.casingRepository.findOneOrFail({ id });
         const updatedCasing = this.casingRepository.assign(casing, dto);
         await this.em.persistAndFlush(updatedCasing);
         return updatedCasing;
    }

    async delete(id: number) : Promise<string> {
        const casing = this.casingRepository.getReference(id);
        if (!casing.id) throw new BadRequestException('Casing not found');
        await this.em.removeAndFlush(casing);
        return "Successfully deleted";
    }
}