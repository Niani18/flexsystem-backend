import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Connector } from "./interface/connector.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ConnectorDTO } from "./dto/connector.dto.js";
import { ConnectorUpdateDTO } from "./dto/connector-update.dto.js"


@Injectable()
export class ConnectorService {
    
    constructor(
        @InjectRepository(Connector)
        private readonly connectorRepository : EntityRepository<Connector>,
        private readonly em : EntityManager
    ) {}


    async findAll() : Promise<Connector[]> {
        return this.connectorRepository.findAll();
    }

    async findById(id : number) : Promise<Connector | null> {
        return this.connectorRepository.findOneOrFail({ id });
    }

    async create(dto : ConnectorDTO) : Promise<Connector> {
        const connector = this.connectorRepository.create(dto);
        await this.em.persistAndFlush(connector);
        return connector;
    }

    async update(id: number, dto : ConnectorUpdateDTO) : Promise<Connector | null> {
        const connector = await this.connectorRepository.findOneOrFail({ id });
        const updatedConnector = this.connectorRepository.assign(connector, dto);
        await this.em.persistAndFlush(updatedConnector);
        return connector;
    }

    async delete(id : number) : Promise<string> {
        const connector = this.connectorRepository.getReference(id);
        if(!connector.id) throw new BadRequestException("Connector not found");
        await this.em.removeAndFlush(connector);
        return "Successfully removed";
    }
}