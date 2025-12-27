import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Supply } from "./interface/supply.entity.js";
import { Screw } from "./interface/screw.entity.js";
import { Tube } from "./interface/tube.entity.js";
import { Elbow } from "./interface/elbow.entity.js";
import { Connector } from "./interface/connector.entity.js";
import { Casing } from "./interface/casing.entity.js";
import { TubeService } from "./tube.service.js";
import { TubeController } from "./tube.controller.js";
import { ScrewService } from "./screw.service.js";
import { ScrewController } from "./screw.controller.js";
import { ElbowController } from "./elbow.controller.js";
import { ElbowService } from "./elbow.service.js";
import { CasingController } from "./casing.controller.js";
import { CasingService } from "./casing.service.js";
import { ConnectorController } from "./connector.controller.js";
import { ConnectorService } from "./connector.service.js";
import { SupplyService } from "./supply.service.js";
import { SupplyController } from "./supply.controller.js";


@Module({
    imports: [
        MikroOrmModule.forFeature([
            Supply, 
            Screw, 
            Tube, 
            Elbow, 
            Connector, 
            Casing
        ])
    ],
    controllers: [
        TubeController, 
        ScrewController, 
        ElbowController, 
        CasingController, 
        ConnectorController,
        SupplyController
    ],
    providers: [
        TubeService,
        ScrewService, 
        ElbowService, 
        CasingService, 
        ConnectorService,
        SupplyService,
    ],
    exports: [
        SupplyService
    ]
})
export class SupplyModule {}