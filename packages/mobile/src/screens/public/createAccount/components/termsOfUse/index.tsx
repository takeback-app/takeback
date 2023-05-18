/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { ScrollView, Modal } from 'react-native'
import { Flex, Heading, Text } from 'native-base'
import { Header } from '../../../../../components/header'

interface ModalProps {
  modalVisible: boolean
  onClose?: () => void
}

export const TermsOfUse: React.FC<ModalProps> = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onClose}
    >
      <Header
        variant="close"
        title="Termos e Condições"
        goBack={props.onClose}
      />
      <Flex flex="1" p="4" bg="white">
        <ScrollView>
          <Heading fontSize="3xl" color="gray.800" fontWeight="bold">
            Termos e Condições de Uso
          </Heading>
          <Text
            fontSize="sm"
            fontWeight="normal"
            textAlign="justify"
            color="gray.900"
            mt="4"
          >
            1. Introdução. Esta Plataforma de Cashback foi desenvolvida e
            mantida pela TakeBack LTDA ("TakeBack"), pessoa jurídica de direito
            privado, inscrita no CNPJ sob o nº 45.231.359/0001-08, sediada na
            Rua Barão do Rio Branco, nº 513 C, bairro Centro, Porteirinha/MG,
            CEP: 39520-000. A TakeBack desenvolveu e explora a tecnologia
            digital ("Plataforma") inserida em seu domínio web –
            www.takeback.app.br – ("Site") e no aplicativo TakeBack
            ("Aplicativo"), sendo essencial para a realização da prestação dos
            serviços a que se dispõe. O presente Termos de Uso ("Termo" ou
            Termos") estabelece a relação contratual entre os clientes que
            utilizam o Site e Aplicativo TakeBack ("Usuários"), estabelecendo as
            regras de utilização e as responsabilidades de cada parte, em
            conformidade com a legislação brasileira, incluindo as disposições
            da Lei Nº 12.965/14 ("Marco Civil da Internet") e do Decreto Nº
            8.771, de 11/05/16 ("Decreto"). Antes de prosseguir, é fundamental
            que você leia e compreenda todos os Termos que regulam a utilização
            do Portal e de seus benefícios informados neste contrato virtual. Ao
            clicar em "aceitar" ao final deste contrato, você estará legalmente
            vinculado a todos os termos e condições aqui presentes. Caso você
            não concorde com qualquer das regras previstas, você deverá não
            aceitar esse Termo e não utilizar o TakeBack. Caso tenha qualquer
            dúvida sobre o conteúdo desses Termos de Uso, entre em contato com
            nosso suporte através do e-mail: suporte@takeback.app.br. 2. A
            TakeBack. 2.1. A Plataforma TakeBack disponibiliza uma Plataforma
            virtual de divulgação e busca de anúncios, ofertas, descontos e
            promoções de diversas lojas online ("Lojas Virtuais") e lojas
            físicas ("Lojas Físicas"), que são chamadas, em conjunto, de
            “Empresa Assinante”. 2.2. A TakeBack atua como divulgador,
            veiculando anúncios de produtos e serviços fornecidos pelas Empresas
            Assinantes. Por essa razão, nós não nos responsabilizamos por
            nenhuma compra ou transação realizada entre vocês e as Empresas
            Assinantes. 2.3. Ao efetuar uma compra em uma Empresas Assinante,
            através do Aplicativo ou de um link disponibilizado no Site, você
            cria uma nova e distinta relação jurídica diretamente com esta
            Empresa, da qual a TakeBack não participa e não poderá responder,
            comercialmente, judicialmente ou de qualquer outra forma. 2.4. Os
            anúncios veiculados na Plataforma podem conter informações sobre
            alguns produtos ou serviços, incluindo preço. No entanto, você deve
            sempre conferir o preço e demais informações dos produtos
            diretamente nas Empresas Assinantes, pois alguns dos anúncios podem
            estar desatualizados e com informações antigas – nós não nos
            responsabilizamos por estas informações. 2.5. A responsabilidade
            pelos produtos e serviços e por suas informações, incluindo o preço,
            é exclusiva e integral das Empresas Assinantes. A TakeBack não é
            proprietária dos Produtos e Serviços oferecidos pelas empresas,
            sendo de sua responsabilidade, unicamente, disponibilizar espaço nos
            Meios Digitais para que as Empresas Assinantes os divulguem aos
            Usuários, processar as transações financeiras referentes a aquisição
            destes. 2.6. É sua obrigação confirmar a veracidade das informações
            dos anúncios constantes na Plataforma diretamente nas próprias
            Empresas Assinantes. Sempre que houver diferença ou divergência
            entre os preços e demais informações de produtos no Portal e no
            Empresas Assinantes, prevalecerá as informações do Empresas
            Assinantes. 2.7. Antes de finalizar qualquer compra/contratação,
            você deverá ler, compreender e aceitar o regulamento específico de
            cada promoção/anúncio, para ajudar na sua correta e efetiva
            utilização do Portal e de seus benefícios. 3. Cadastro no TakeBack.
            3.1. Primeiramente, você deve fazer um cadastro em nosso Aplicativo,
            prestando algumas informações, os quais estarão sujeitos à nossa
            análise e aprovação. Você está ciente que ao se cadastrar em nosso
            Aplicativo, autoriza que a TakeBack, controlados, coligados e
            Parceiros, consulte as suas informações que constem ou venham a
            constar no Sistema de Informações de Crédito (SCR), ou dos sistemas
            que venham a complementá-lo ou a substituí-lo, cuja finalidade é
            prover informações ao Banco Central do Brasil (BACEN) para
            monitoramento do crédito no sistema financeiro e fiscalização, bem
            como propiciar o intercâmbio de informações entre instituições
            financeiras sobre o montante de responsabilidade de seus clientes em
            operações de crédito. Mas não se preocupe, suas informações e dados
            pessoais fornecidos serão armazenados em nossos sistemas, de forma
            confidencial e segura, e serão tratados conforme nossa Política de
            Privacidade. 3.2. As informações prestadas no cadastro devem ser
            exatas, precisas e verdadeiras, e você se compromete a atualizar o
            cadastro sempre que houver alguma alteração nos seus dados. Nós
            poderemos utilizar de todos os meios legais para confirmar a
            veracidade desses dados, embora não nos responsabilizamos, em
            hipótese nenhuma, por dados incorretos ou não verdadeiros informados
            por você. Isto é, você nos garante e assume responsabilidade pela
            veracidade, exatidão e autenticidade de todos os dados que nos
            fornecer. 3.3. Após a conclusão do cadastro, você terá um nome de
            usuário e uma senha. Este nome de usuário e esta senha são de uso
            pessoal e intransferível, e de uso exclusivo por você, não podendo
            ser repassados a terceiros. Você assume, portanto, total
            responsabilidade por sua guarda e sigilo, com a obrigação de evitar
            que sejam utilizados por outras pessoas. 3.4. Recomendamos
            fortemente que você mude sua senha periodicamente, e que não utilize
            senhas que facilitem a adivinhação por terceiros, como números de
            telefone, endereço, datas de nascimento, nomes de parentes, etc. 4.
            O Cashback. 4.1. A TakeBack oferece também uma oportunidade para que
            você possa receber um desconto especial da compra de um produto ou
            serviço das nossas Empresas Assinantes. Esse desconto especial é
            concedido pela Empresa assinante através do reembolso em forma de
            crédito de parte do valor gasto por você nas compras efetuadas
            através da nossa Plataforma, chamado por nós de Cashback. 4.2. O
            Cashback não é cumulativo com outras promoções, descontos, programas
            de fidelidade ou condições especiais ofertadas pelas Empresas
            Assinantes ou por terceiros, portanto fique atento a essa restrição!
            A utilização de qualquer outro benefício invalidará o seu Cashback.
            4.3. Para ter direito ao Cashback é importante que o Usuário observe
            as Condições de Uso, o presente Termo, além dos requisitos básicos
            ("Requisitos Essenciais"), definidos no item 5 desses Termos. 4.4. O
            Cashback funciona de maneira bem simples: na nossa Plataforma, nós
            realizamos uma promessa de recompensa, que será devida a qualquer
            pessoa que cumprir os Requisitos Essenciais. Isto é: se você cumprir
            os Requisitos Essenciais, nós o creditamos com a recompensa
            prometida: o Cashback. 4.5. Para que a recompensa seja creditada na
            sua conta, a Empresa assinante precisará efetuar o pagamento à
            TakeBack do valor devido, sendo de sua total responsabilidade este
            pagamento. 4.6. A TakeBack não tem responsabilidade alguma sobre o
            pagamento dessa recompensa, atuando apenas como intermediadora das
            transações. 5. Os Requisitos Essenciais. 5.1. Para que você adquira
            o direito à recompensa prometida pelo TakeBack, na forma de crédito
            de parte do valor gasto em determinada aquisição pela Plataforma (o
            Cashback), é necessário observar os requisitos abaixo, definidos de
            acordo com as Empresas Assinantes envolvidas na compra. Nas compras
            realizadas, é indispensável o cumprimento de todos os requisitos
            abaixo, cumulativamente: A. Efetuar o cadastro e login no Aplicativo
            da TakeBack; B. Informar, no momento da compra, que você é Usuário
            TakeBack e solicitar um meio de pagamento credenciado pela TakeBack;
            C. Realizar o pagamento através de um meio de pagamento credenciado
            pelo TakeBack; D. Finalizar a compra na Empresa Assinante com o
            mesmo CPF cadastrado na TakeBack; E. O saldo ficará pendente até que
            a Empresas Assinantes efetue o pagamento dos Cashbacks gerados à
            TakeBack; F. A liberação do saldo no Aplicativo TakeBack só será
            possível a partir do pagamento dos Empresas Assinantes, sendo dela a
            total responsabilidade pelo mesmo; G. Efetuar os procedimentos de
            uso da recompensa, utilizando o saldo disponível para abatimento de
            nova compra em uma Empresa credenciada na TakeBack. 5.2. Ao dizermos
            que os Requisitos Essenciais são cumulativos, significa que todos
            deverão ser cumpridos para que surja o direito ao recebimento do
            Cashback. 5.3. Os valores demonstrados na sua conta TakeBack como
            “Saldo Pendente” são meramente indicativos, e não representam nenhum
            direito adquirido, pois os Requisitos Essenciais ainda não foram
            integralmente cumpridos. 5.4. A compra não será considerada
            concluída pela Empresas Assinantes, caso sejam realizadas quaisquer
            trocas, cancelamentos ou devoluções de produtos. Por isso, para que
            os valores de reembolso sejam confirmados, é importante que não haja
            troca, cancelamento ou devolução do produto. 5.5. O Cashback
            referente a cada compra é confirmado ou cancelado na sua área
            'Cashback' em até 50 (cinquenta) dias após a data da compra. Os
            valores somente serão confirmados se a Empresas Assinantes efetuar o
            pagamento do cashback referente à sua compra, caso contrário serão
            cancelados. 5.6. A TakeBack poderá disponibilizar o Cashback na área
            'Cashback' em prazo inferior ao estipulado acima. Entretanto,
            durante o prazo de 50 (cinquenta) dias após a compra, a TakeBack se
            reserva o direito de cancelar o Cashback disponibilizado e realizar
            os ajustes necessários no saldo do Usuário. Portanto, é importante
            que o Usuário esteja ciente que os valores constantes na área
            'Cashback' podem sofrer alterações em razão do descumprimento dos
            Requisitos do Cashback dispostos neste Termo. 5.7. Caso você entenda
            que ocorreu algum erro com a confirmação de sua compra e com o
            respectivo crédito do Cashback, poderá abrir uma Reclamação na
            Plataforma à partir dos canais de atendimento disponibilizados,
            ciente de que: a) Você deverá nos informar alguns detalhes da sua
            compra, para que possamos entrar em contato com a Empresas
            Assinantes e apurar o erro; b) O pedido será periodicamente
            acompanhado e atualizado por nós, e os canais de atendimento estarão
            sempre aptos a atendê-lo, mas é importante que você saiba que as
            Empresas Assinantes podem demorar algumas semanas ou até alguns
            meses para analisar as reclamações; e c) Se identificarmos uma
            reclamação falsa, fraudulenta ou de má-fé, sua conta na TakeBack
            poderá ser excluída, com a automática expiração de eventual saldo.
            5.8. O seu saldo de Cashback é cumulativo, e vai aumentando a cada
            compra confirmada. Os valores não estão sujeitos à correção
            monetária por qualquer forma, e conforme já mencionado nestes Termos
            de Uso, são meramente indicativos e ainda não representam um direito
            seu a recebê-los. 5.9. A TakeBack poderá solicitar informações
            complementares para liberação do resgate do Cashback, como a
            comprovação da identidade do usuário, através do envio de uma foto
            própria (selfie) ao lado de um documento de identidade; além dos
            documentos de comprovação de compra, através do envio de uma cópia
            de documento fiscal. 5.10. Caso sejam apuradas irregularidades na
            obtenção do Cashback, o TakeBack poderá suspendê-lo pelo período de
            até 60 (sessenta) dias para análise interna. Ocorrendo a suspensão,
            a TakeBack poderá solicitar informações complementares nos termos do
            item anterior para liberação do Cashback. E sendo confirmada a
            irregularidade, o Cashback poderá ser cancelado e a conta do Usuário
            poderá ser bloqueada. 5.11. Importante! Cada saldo referente a um
            Cashback obtido por você expirará em 730 (setecentos e trinta) dias,
            ou seja, aproximadamente 2 (dois) anos, contados da data de
            confirmação de cada Cashback. Caso você não efetue o resgate do
            saldo no TakeBack dentro deste período, seu saldo de Cashback
            expirará e será zerado, e você não poderá mais adquirir o direito de
            utilizar este valor. Assim, se você, por exemplo, obtiver um saldo
            de Cashback R$10,00 (dez reais) em uma determinada compra feita em
            10/01/2022 e esse valor for confirmado em 15/03/2022, caso você não
            o resgatar até 14/03/2024, no dia seguinte, esse saldo específico
            corresponderá a zero. 5.12. O valor referente aos resgates
            solicitados será creditado em forma de crédito 5.13. É muito
            importante que você saiba que o programa de Cashback é mantido por
            prazo indeterminado, e poderá ser suspenso ou cancelado a qualquer
            momento, sem necessidade de notificação prévia. Nessa ocasião, os
            Usuários terão um prazo de 30 (trinta) dias contados da data de
            cancelamento do programa para utilizar o saldo de sua conta, caso
            tenham cumprido todos os demais Requisitos Essenciais. Após esse
            prazo os Usuários não poderão mais adquirir o direito de resgate do
            seu saldo acumulado, e a TakeBack não poderá ser responsabilizada
            por nenhum valor de reembolso indicado na conta dos Usuários, cujo
            resgate não houver sido solicitado dentro do prazo. 6.
            Responsabilidades e outras questões. 6.1. É de sua responsabilidade
            manter seu sistema protegido contra vírus e outros malwares. Dessa
            forma, não nos responsabilizamos por danos causados por vírus e
            malwares em decorrência de acesso, utilização ou navegação no site
            na internet ou como consequência da transferência de dados,
            arquivos, imagens, textos ou áudio contidos no mesmo. É de sua
            responsabilidade a certificação de estar acessando sua conta em
            redes seguras. 6.2. Não somos responsáveis por qualquer ação ou
            omissão dos Usuários tomada com base em informações, anúncios ou
            outros materiais veiculados na Plataforma. 6.3. A TakeBack se
            esforça para manter a Plataforma sempre atualizada, mas não temos
            responsabilidade sobre qualquer informação imprecisa, inexata,
            errada, fraudulenta ou divergente nos materiais veiculados pelas
            Empresas Assinantes. Por isso, é sempre importante que você acesse
            diretamente o site das Empresas Assinantes para confirmar e obter as
            informações necessárias sobre os produtos e serviços. 6.4. Por ser
            uma plataforma virtual de publicidade virtual, que apenas veicula e
            divulga propagandas e informações de produtos ou serviços das
            Empresas Assinantes, não nos responsabilizamos por compras efetuadas
            entre vocês e as Empresas Assinantes. Da mesma forma, não prestamos
            garantia, em qualquer hipótese, de produtos ou serviços adquiridos,
            e estamos isentos de quaisquer reivindicações ou ações judiciais
            propostas por Usuários ou terceiros. 6.5. É muito importante que
            você entenda que a TakeBack não possui qualquer responsabilidade
            sobre as seguintes situações, que deverão ser resolvidas diretamente
            com as Empresas Assinantes dos quais vocês efetuaram as compras: a)
            Conteúdo e funcionamento dos sites ou lojas dos Empresas Assinantes;
            b) Negociações e transações comerciais feitas entre os Usuários e os
            Empresas Assinantes, assim como eventuais danos e prejuízos
            resultantes; c) Origem, qualidade, quantidade e entrega dos produtos
            e serviços divulgados pelos Empresas Assinantes; e d) Obrigações de
            natureza tributária aplicáveis às transações entre os Usuários e as
            Empresas Assinantes. 6.6. Nós também não nos responsabilizamos por
            opiniões e reclamações de Usuários sobre as Empresas Assinantes,
            seus produtos ou serviços, sendo a responsabilidade exclusiva de
            quem as emitiu. 7. Outros assuntos. 7.1. Esse Termos de Uso
            constitui documento jurídico integral e perfeito para regular a
            relação, e poderá ser modificado livremente e a qualquer tempo pelo
            TakeBack sem aviso prévio, sendo responsabilidade do Usuário
            verificar as atualizações das versões futuras. Os Usuários, por sua
            vez, terão um prazo de 30 (trinta) dias para manifestarem sua
            concordância aos novos Termos. Caso a manifestação não seja
            realizada durante esse período, a TakeBack poderá considerar,
            legitimamente, a concordância tácita aos novos Termos de Uso. Os
            novos termos terão validade a partir da data em que forem veiculados
            no site TakeBack, reservando-se ao usuário o direito de permanecer
            cadastrado ou simplesmente solicitar sua exclusão. 7.2. A TakeBack
            poderá, a qualquer momento e a seu exclusivo critério, modificar a
            configuração da Plataforma, podendo também eliminar ou acrescentar
            quaisquer Empresas Assinantes cadastrados em seu banco de dados.
            7.3. Todo o conteúdo (incluindo, mas não se limitando a, marcas,
            modelos, textos, programas de computador, sons, fotografias e outros
            materiais disponíveis na Plataforma do TakeBack), a aparência, a
            organização e a estrutura da TakeBack são protegidas pela legislação
            de propriedade intelectual e não infringem qualquer lei ou norma a
            que estejam subordinadas, contratos, documentos, acordos dos quais
            faz parte, bem como não infringem direitos de terceiros. A violação
            de tais direitos ensejará a respectiva indenização aos prejudicados,
            sem prejuízo de perdas e danos e honorários advocatícios. 7.4. É
            vedado ao Usuário modificar, copiar, distribuir, transmitir, exibir,
            realizar, reproduzir, publicar, disponibilizar, licenciar ou criar
            obras derivadas a partir das informações coletadas na Plataforma,
            bem como transferir ou vender tais informações, software, produtos
            ou serviços, sob pena de violação do presente termo e infração
            legal. 7.5. Os benefícios do TakeBack estão disponíveis apenas para
            as pessoas que tenham capacidade legal para contratá-los. Não podem
            utilizá-los, assim, pessoas que não gozem dessa capacidade. 7.6. A
            TakeBack, poderá oferecer benefícios aos Usuários que indicarem,
            através de link disponibilizado no Site e/ou Aplicativo, amigos para
            utilizarem a TakeBack. Esses benefícios serão conferidos aos
            Usuários de acordo com o regulamento da promoção vigente, sendo
            certo que o principal requisito é a constatação de que os Novos
            Usuários foram cadastrados através da indicação do Usuário pelo
            envio do referido link. 7.6. O regulamento da promoção poderá prever
            o envio de e-mails pelo TakeBack às pessoas indicadas, contendo o
            nome do Usuário que enviou o link de recomendação, com o intuito de
            relembrá-las a utilizarem e aproveitarem os serviços TakeBack. 7.7.
            Não é permitido que uma mesma pessoa tenha mais de um cadastro. Se a
            TakeBack detectar, através do sistema de verificação de dados,
            cadastros duplicados, irá inabilitar definitivamente todos os
            cadastros. 7.8. A TakeBack poderá advertir, suspender, bloquear ou
            cancelar, temporária ou definitivamente, a conta de um Usuário e
            realizar a extração dos valores obtidos indevidamente, além de tomar
            as medidas legais cabíveis, a qualquer momento, por qualquer motivo,
            a seu único critério, bem como se: (1) o Usuário não cumprir
            qualquer dispositivo destes Termos de Uso; (2) praticar atos
            fraudulentos, dolosos ou com evidente má-fé, a fim de obter vantagem
            indevida; (3) identificar atos do usuário realizados com a
            finalidade de induzir ao erro para obter vantagem manifestamente
            ilícita; (4) não puder ser verificada a identidade do Usuário ou
            qualquer informação fornecida por ele seja inverídica; (5) alguma
            atitude do Usuário tiver o condão de danos a terceiros ou ao próprio
            TakeBack; (6) o usuário divulgar ou postar conteúdo em desacordo com
            a legislação vigente, com os bons costumes, ou ofensivo ao direito
            de qualquer pessoa; (7) o usuário adotar, no âmbito da relação com a
            TakeBack, bem como seus representantes e funcionários, condutas
            desrespeitosas, ofensivas, difamatórias, obscenas, ilegais ou
            realizar ameaças; e (8) praticar SPAM ou qualquer tipo de atitudes
            contrárias às boas práticas da internet e das redes sociais. 7.9. Se
            houver algum conflito de informações constantes neste contrato com
            informações constantes em outros documentos, prevalecerão sempre os
            termos deste contrato, que é o documento formal eleito para reger
            nossa relação. 7.10. Por fim, caso seja necessário dirimir qualquer
            dúvida ou controvérsia decorrente deste contrato, o foro eleito é o
            da Comarca de Porteirinha/MG, com renúncia de todos os outros, por
            mais privilegiados que sejam. Isto significa que, caso seja
            necessário discutirmos algo na Justiça, as ações devem ser propostas
            em Porteirinha/MG. 7.11. Agora que você já leu todos os nossos
            Termos de Uso, poderá indicar se está de acordo com todos eles
            realizando o seu cadastro e se tornando um Usuário TakeBack!
            Bem-vindo!
          </Text>
        </ScrollView>
      </Flex>
    </Modal>
  )
}
