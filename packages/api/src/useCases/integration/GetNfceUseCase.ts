import { XMLParser } from "fast-xml-parser";
import { Nfce } from "../../@types/Nfce";

class GetNfceUseCase {
	handle(xmlContents: string) {
		const parser = new XMLParser();

		return parser.parse(xmlContents) as Nfce;
	}
}

export default new GetNfceUseCase();
