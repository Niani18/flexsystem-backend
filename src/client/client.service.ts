import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "./interface/client.entity.js";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ClientCreateDTO } from "./dto/client.dto.js";
import { ClientDtoUpdate } from "./dto/clientupdate.dto.js";
import { ClientPaginationDTO } from "./dto/client-pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { CLIENT_SORT_CONFIG } from "./sort/client-sort.config.js";
import { User } from "src/auth/interface/user.entity.js";

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private readonly clientService: EntityRepository<Client>,
    private readonly em: EntityManager
  ){}

  async findAll(): Promise<Client[] | null> {
    return await this.clientService.findAll()
  }

  async findOne(email: string): Promise<Client | null>{
    return await this.clientService.findOneOrFail({email})
  }

  async findByUser(user: User) : Promise<Client | null> {
    return await this.clientService.findOneOrFail({ user: user.id });
  }

  async create(client: ClientCreateDTO): Promise<Client>{
    const clientCreate = this.clientService.create(client)
    await this.em.persistAndFlush(clientCreate)
    return clientCreate
  }

  async update(id: number, client: ClientDtoUpdate): Promise<Client>{
    const clientUpdate = await this.clientService.findOneOrFail(id)
    this.clientService.assign(clientUpdate, client)
    await this.em.persistAndFlush(clientUpdate)
    return clientUpdate
  }

  async delete(id: number){
    const client = this.clientService.getReference(id)
    if (client.id){
      await this.em.removeAndFlush(client)
      return 'client delete succesfully'
    }
    throw new BadRequestException('Client not found')

  }

  async search(query: ClientPaginationDTO) {
    const qb = this.clientService.qb("cl");
    qb.leftJoinAndSelect("cl.order", "od");

    if(query.nameAndSurname) {
      const [name, surname] = query.nameAndSurname.split(" ");
      qb.andWhere("(cl.name LIKE CONCAT(?, '%') AND cl.surname LIKE CONCAT(?, '%'))", [name.trim(), surname?.trim() ?? ""]) 
    }

    const pene = parseSort(CLIENT_SORT_CONFIG, query.sort);
    for(const {column, dir} of pene) {
      qb.orderBy({ [column]: dir })
    }

    const [data, total] = await qb.limit(query.limit)
        .offset((query.page - 1) * query.limit)
        .getResultAndCount();
    
    return {
      data,
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
      sort: pene
    }
  }

}