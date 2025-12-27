import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Dealer } from "./interface/dealer.entity.js";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { DealerCreateDTO } from "./dto/dealer.dto.js";
import { DealerDTOUpdate } from "./dto/dealer-update.dto.js";
import { DealerPaginationDTO } from "./dto/dealer-pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { DEALER_SORT_CONFIG } from "./sort/dealer-sort.config.js";



@Injectable()
export class DealerService {
  
  constructor(
    @InjectRepository(Dealer)
    private readonly dealerService: EntityRepository<Dealer>,
    private readonly em: EntityManager
  ){}
  

  async search(query : DealerPaginationDTO) {
    const qb = this.dealerService.qb("de");

    if (query.cuil) qb.andWhere({ cuil: query.cuil });
    if (query.nameAndSurname) {
      const [name, surname] = query.nameAndSurname?.split(" ") ?? [null, null];
      qb.andWhere("(name = CONCAT(?, '%') AND surname = CONCAT(?, '%'))", [name.trim(), surname?.trim() ?? ""]); // Puse OR por si escribe uno mal.
    }
    if (query.state) qb.andWhere({ state: query.state });

    const order = parseSort(DEALER_SORT_CONFIG, query.sort);
    for (const {column, dir} of order) {
      qb.orderBy({ [column]: dir });
    }

    const [data, total] = await qb
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
      .getResultAndCount();

    return {
      data,
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
      sort: order,
    };
  }

  async findAll(): Promise<Dealer[]> {
    return await this.dealerService.findAll({populate: ['delivery']})
  }

  async findOne(id: number): Promise<Dealer | null> {
    return await this.dealerService.findOneOrFail(id, {populate: ['delivery']})
  }
  
  async update(id: number, dealer: DealerDTOUpdate): Promise<Dealer> {
    const dealerUpdate = await this.dealerService.findOneOrFail(id)
    this.dealerService.assign(dealerUpdate, dealer)
    await this.em.persistAndFlush(dealerUpdate)
    return dealerUpdate
  }
  
  async delete(id: number){
    const dealer = this.dealerService.getReference(id)
    if (!dealer.id)
      throw new BadRequestException('Dealer not found');
    await this.em.removeAndFlush(dealer)
    return 'Dealer delete succesfully'
  }

  async create(dto: DealerCreateDTO): Promise<Dealer> {
    const dealer = this.dealerService.create(dto)
    await this.em.persistAndFlush(dealer)
    return dealer;
  }
    
}