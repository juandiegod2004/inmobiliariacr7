import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-6">
        
        {/* Header de la Página */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl text-secondary mb-2">
            <span className="material-symbols-outlined text-4xl">
              gavel
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-extrabold">
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
            CR7 INMOBILIARIA &bull; Santa Marta
          </p>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Contenido Principal en Tarjeta Premium */}
        <div className="bg-surface border border-outline-variant/20 rounded-3xl shadow-soft-coastal p-6 md:p-10 space-y-8 text-on-surface leading-relaxed">
          
          {/* Introducción */}
          <div className="space-y-4">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
            </h2>
            <p className="text-body-md text-on-surface-variant">
              <strong>CR7 INMOBILIARIA</strong> pone a conocimiento de los Titulares de los Datos Personales que sean tratados de cualquier manera por la empresa esta política de tratamiento de la información, dando cumplimiento con ello a la Ley. El propósito principal de esta Política es poner en conocimiento de los Titulares de los Datos Personales los derechos que les asisten, los procedimientos y mecanismos dispuestos por la empresa para hacer efectivos esos derechos de los Titulares, y darles a conocer el alcance y la finalidad del Tratamiento al cual serán sometidos los Datos Personales en caso de que el Titular otorgue su autorización expresa, previa e informada. 
            </p>
            <p className="text-body-md text-on-surface-variant">
              La empresa así también ratifica su compromiso con los diversos grupos de interés con los que se relaciona; y con el manifiesto interés de respetar todos los derechos de los mismos, especialmente con este instrumento su derecho al Hábeas Data, a la intimidad y otros conexos.
            </p>
          </div>

          <hr className="border-outline-variant/30" />

          {/* CAPÍTULO I */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-primary">CAPÍTULO I</h3>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mt-0.5">Disposiciones Generales</p>
            </div>

            {/* ARTÍCULO PRIMERO */}
            <div className="space-y-4">
              <h4 className="font-bold text-primary text-base">ARTÍCULO PRIMERO: DEFINICIONES</h4>
              <p className="text-body-sm text-on-surface-variant mb-4">
                Las presentes definiciones se relacionan con el significado que se les debe dar a los términos dentro del presente documento:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { term: "a) Autorización", desc: "Es el consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de sus datos personales." },
                  { term: "b) Base de Datos", desc: "Es el conjunto de datos personales que son objeto de Tratamiento sin importar la modalidad del mismo." },
                  { term: "c) Dato Financiero", desc: "Es todo Dato Personal referido al nacimiento, ejecución y extinción de obligaciones dinerarias, independientemente de la naturaleza del contrato que les dé origen, cuyo Tratamiento se rige por las normas correspondientes." },
                  { term: "d) Dato Personal", desc: "Es cualquier información relacionada o relacionable a una persona natural." },
                  { term: "e) Dato Público", desc: "Es aquél que la ley denomina como tal, o el que reposa en registros, certificados, documentos o Bases de Datos con carácter público." },
                  { term: "f) Dato Sensible", desc: "Es el dato personal relacionado con la intimidad del Titular o que puede dar lugar a discriminaciones o tratos diferenciados. También forman parte de esta categoría los datos biométricos." },
                  { term: "g) Encargado del Tratamiento", desc: "Es la persona natural o jurídica, de naturaleza pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de Datos Personales por cuenta del responsable del Tratamiento." },
                  { term: "h) Autorizado", desc: "Es la persona y sus dependientes que por virtud de la Autorización y de estas Políticas tienen legitimidad para Tratar los Datos Personales del Titular. El Autorizado incluye al género de los Habilitados." },
                  { term: "i) Habilitación", desc: "Es la legitimación que expresamente y por escrito mediante contrato o documento que haga sus veces, otorgue la Compañía a terceros, en cumplimiento de la Ley aplicable, para el Tratamiento de Datos Personales, convirtiendo a tales terceros en Encargados del Tratamiento de los Datos Personales entregados o puestos a disposición." },
                  { term: "j) Responsable de Tratamiento", desc: "Es la persona, autorizada por el Titular, que administra y toma decisiones respecto de la Base de Datos." },
                  { term: "k) Titular", desc: "Es la persona natural a quien se refieren los datos que reposan en la Base de Datos, y el objeto de protección de la Ley y normas concordantes." },
                  { term: "l) Transferencia", desc: "Es la comunicación de los datos personales entre el Encargado y el responsable del tratamiento." },
                  { term: "m) Transmisión", desc: "Es la actividad de Tratamiento de Datos Personales mediante la cual se comunican los mismos, internamente o con terceras personas, dentro o fuera del país, cuando dicha comunicación tenga por objeto la realización de cualquier actividad de Tratamiento de datos personales." },
                  { term: "n) Tratamiento de Datos Personales", desc: "Es toda actividad encaminada al procesamiento de Bases de Datos, así como también su transferencia a terceros." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest border border-outline-variant/10 p-4 rounded-xl">
                    <span className="font-semibold text-primary block text-sm mb-1">{item.term}</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ARTÍCULO SEGUNDO */}
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-base">ARTÍCULO SEGUNDO: OBJETO</h4>
              <p className="text-body-md text-on-surface-variant">
                La Política de Tratamiento de Bases de Datos e Información tiene por objeto desarrollar el procedimiento para recolectar, almacenar, usar y realizar cualquier actividad sobre datos personales, y los demás derechos, libertades y garantías constitucionales; así como el derecho a la información de la misma, según lo estipula la ley y demás normas concordantes.
              </p>
            </div>

            {/* ARTÍCULO TERCERO */}
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-base">ARTÍCULO TERCERO: SUJECIÓN A DISPOSICIONES LEGALES</h4>
              <p className="text-body-md text-on-surface-variant">
                La Empresa manifiesta que las directrices para el Tratamiento de datos personales serán las dispuestas por las normas vigentes en la materia.
              </p>
            </div>

            {/* ARTÍCULO CUARTO */}
            <div className="space-y-4">
              <h4 className="font-bold text-primary text-base">ARTÍCULO CUARTO: FINALIDADES DE LOS DATOS RECAUDADOS</h4>
              <p className="text-body-md text-on-surface-variant">
                Todos los datos que La empresa recauda, están encaminados a:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-body-sm text-on-surface-variant">
                <li>
                  <strong>i)</strong> Generar y administrar el acervo de toda la información necesaria para el cumplimiento de las obligaciones tributarias, comerciales, civiles, laborales, legales y en general toda obligación que ataña a La empresa.
                </li>
                <li>
                  <strong>ii)</strong> Administrar La empresa, respecto de sus clientes, proveedores, accionistas y otros grupos de interés. Frente a los clientes, la información recolectada puede utilizarse para: entrega de información a entidades financieras para gestión de servicios financieros; fidelización de clientes; gestión de servicio al cliente; publicidad; mercadeo; gestión y contacto comercial; contactos para correos informativos; envío de correspondencia física y por correo electrónico; gestión de cartera; oferta de compraventa, renta y permuta de bienes inmuebles; recibo y envío de ofertas inmobiliarias; traslado de información con fines contractuales; actualizar o corregir datos de inmuebles; información de nuestros aliados comerciales; realización de llamadas (call center) con fines administrativos, comerciales y publicitarios; y en general, información relacionada con la actividad que impliquen los contratos suscritos entre las partes; desarrollar tecnologías, servicios o planes que representen un mejor servicio para los clientes.
                </li>
                <li>
                  <strong>iii)</strong> Dar cumplimiento a las obligaciones legales y contractuales de La empresa.
                </li>
                <li>
                  <strong>iv)</strong> Actuar dentro del marco de los requerimientos legales a efectos de verificar la naturaleza jurídica y situación de algunos clientes, contratistas o proveedores.
                </li>
                <li>
                  <strong>v)</strong> Conservar el archivo físico o digital por el tiempo legalmente requerido de tal forma que puedan ser consultados posteriormente por el Titular o una autoridad.
                </li>
                <li>
                  <strong>vi)</strong> La transferencia y transmisión de las Bases de Datos cuando sea necesario para cumplir acciones de cobranza, trámite de créditos, acciones judiciales y en general los demás fines previstos en el presente numeral.
                </li>
                <li>
                  <strong>vii)</strong> Gestión de información de empleados relacionados con nómina, gestión social, seguridad social, procesos de selección, vinculación contractual y bienestar del empleado.
                </li>
                <li>
                  <strong>ix)</strong> Las demás actividades necesarias para la prestación efectiva de cualquiera de los servicios habituales o accidentales que preste La empresa.
                </li>
              </ul>
            </div>

            {/* ARTÍCULO QUINTO */}
            <div className="space-y-4">
              <h4 className="font-bold text-primary text-base">ARTÍCULO QUINTO: PRINCIPIOS</h4>
              <p className="text-body-md text-on-surface-variant">
                Los principios que se indican en el presente artículo son los lineamientos que serán respetados por La empresa en los procesos de recolección, almacenamiento, uso y administración de los datos personales:
              </p>
              
              <div className="space-y-3 pl-4 border-l-2 border-secondary/30">
                {[
                  { name: "Principio de legalidad en materia de Tratamiento de datos personales", desc: "El Tratamiento a que se refiere la presente Política es una actividad regulada por ley, que debe sujetarse a lo establecido en ella y en las demás disposiciones que la desarrollen." },
                  { name: "Principio de finalidad", desc: "El Tratamiento obecece a las finalidades establecidas en el artículo cuarto del presente documento." },
                  { name: "Principio de libertad", desc: "El Tratamiento sólo puede ejercerse con el consentimiento, previo, expreso e informado del Titular. Los datos personales no podrán ser obtenidos o divulgados sin previa autorización, o en ausencia de mandato legal o judicial que releve el consentimiento." },
                  { name: "Principio de veracidad", desc: "La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible." },
                  { name: "Principio de transparencia", desc: "En el Tratamiento debe garantizarse el derecho del Titular a obtener del responsable del Tratamiento o del Encargado del Tratamiento, en cualquier momento y sin restricciones, información acerca de la existencia de datos que le conciernan." },
                  { name: "Principio de acceso y circulación restringida", desc: "El Tratamiento de los datos personales y las Bases de Datos sólo podrá hacerse por La empresa o quien esta delegue según la autorización brindada por el Titular. Los datos personales no podrán estar disponibles en medios de acceso público y difusión masiva. En caso de almacenarse en la nube, softwares o mecanismos similares, estos tendrán acceso restringido y no serán de carácter público." },
                  { name: "Principio de seguridad", desc: "La empresa brindará condiciones mínimas de seguridad para proteger la información contenida en sus Bases de Datos, para el efecto se implementarán medidas básicas de archivo respecto de los documentos físicos y sistemas de seguridad digital como anti-virus y/o almacenamientos en la nube para los archivos digitales." },
                  { name: "Principio de seguridad y confidencialidad", desc: "Por regla general y salvo lo dispuesto en la Ley, en el respectivo contrato, o en la presente Política (con la autorización del Titular en los últimos dos casos) la información y los datos personales serán de tratamiento confidencial." }
                ].map((princ, idx) => (
                  <div key={idx} className="space-y-1">
                    <strong className="text-primary text-sm font-semibold">{princ.name}:</strong>
                    <p className="text-body-sm text-on-surface-variant">{princ.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <hr className="border-outline-variant/30" />

          {/* CAPÍTULO II */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-primary">CAPÍTULO II</h3>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mt-0.5">Derechos y Deberes</p>
            </div>

            {/* ARTÍCULO SEXTO */}
            <div className="space-y-4">
              <h4 className="font-bold text-primary text-base">ARTÍCULO SEXTO: DERECHOS DEL TITULAR DE LOS DATOS PERSONALES</h4>
              <p className="text-body-md text-on-surface-variant">
                De acuerdo con la Ley, los Titulares de Datos Personales tienen los siguientes derechos:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-body-sm text-on-surface-variant">
                <li><strong>i)</strong> Conocer, actualizar y rectificar sus Datos Personales frente a la empresa o los Encargados del Tratamiento de los mismos. Este derecho se podrá ejercer, entre otros, frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado.</li>
                <li><strong>ii)</strong> Solicitar prueba de la Autorización otorgada a la empresa, salvo que la Ley indique que dicha Autorización no es necesaria.</li>
                <li><strong>iii)</strong> Presentar solicitudes ante la empresa o el Encargado del Tratamiento respecto del uso que le ha dado a sus datos personales, y a que éstas le entreguen tal información.</li>
                <li><strong>iv)</strong> Presentar ante un organismo de control competente las quejas por infracciones a la Ley.</li>
                <li><strong>v)</strong> Revocar su Autorización y/o solicitar la supresión de sus Datos Personales de las bases de datos de la empresa, cuando la Superintendencia de Industria y Comercio haya determinado mediante acto administrativo definitivo que en el Tratamiento la empresa o el Encargado del Tratamiento ha incurrido en conductas contrarias a la Ley o cuando no hay una obligación legal o contractual de mantener el dato personal en la base de datos del Responsable.</li>
                <li><strong>vi)</strong> Solicitar acceso y acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento de acuerdo con la Ley.</li>
                <li><strong>vii)</strong> Conocer las modificaciones a los términos de esta Política de manera previa y eficiente a la implementación de las nuevas modificaciones o, en su defecto, de la nueva política de tratamiento de la información;</li>
                <li><strong>viii)</strong> Tener fácil acceso al texto de esta Política y sus modificaciones;</li>
                <li><strong>ix)</strong> Acceder de manera fácil y sencilla a los datos personales que se encuentran bajo el control de la empresa para ejercer efectivamente los derechos que la Ley les otorga a los Titulares;</li>
                <li><strong>x)</strong> Conocer a la dependencia o persona facultada por la empresa frente a quien podrá presentar quejas, consultas, reclamos y cualquier otra solicitud sobre sus datos personales.</li>
              </ul>

              <p className="text-body-sm text-on-surface-variant bg-surface-container/50 p-4 rounded-xl italic">
                Los Titulares podrán ejercer sus derechos de Ley y realizar los procedimientos establecidos en esta Política, mediante la presentación de su documento de identificación original. Los menores de edad podrán ejercer sus derechos personalmente, o a través de sus padres o los adultos que detenten la patria potestad, quienes deberán demostrarlo mediante la documentación pertinente. Así mismo podrán ejercer los derechos del Titular los causahabientes que acrediten dicha calidad, el representante y/o apoderado del titular con la actualización correspondiente y aquellos que han hecho una estipulación a favor de otro o para otro. Las peticiones podrán radicarse físicamente o vía correo electrónico según los datos del encabezado.
              </p>
            </div>

            {/* ARTÍCULO SÉPTIMO */}
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-base">ARTÍCULO SÉPTIMO: ENCARGADO Y RESPONSABLE DEL TRATAMIENTO DE DATOS PERSONALES</h4>
              <p className="text-body-md text-on-surface-variant">
                La empresa será directamente quien fungirá como Responsable y como Encargado del Tratamiento de datos personales; en su interior podrá delegar cualquier área o dependencia para tales efectos. En general La empresa se compromete a:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-body-sm text-on-surface-variant">
                <li><strong>i)</strong> Recibir las solicitudes de los Titulares de datos personales, tramitar y responder aquellas que tengan fundamento en la Ley o este documento, como por ejemplo: solicitudes de actualización de datos personales; solicitudes de conocer los datos personales; solicitudes de supresión de datos personales cuando el Titular presente copia de la decisión de un organismo de control competente de acuerdo con lo establecido en la Ley, solicitudes de información sobre el uso dado a sus Datos Personales, solicitudes de actualización de los Datos Personales, solicitudes de prueba de la Autorización otorgada, cuando ella hubiere procedido según la Ley;</li>
                <li><strong>ii)</strong> Dar respuesta a los Titulares de los Datos Personales sobre aquellas solicitudes que no procedan de acuerdo con la Ley. Los datos de contacto de la empresa son los indicados en la sección correspondiente.</li>
              </ul>
            </div>

          </div>

          <hr className="border-outline-variant/30" />

          {/* CAPÍTULO III */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
              <h3 className="font-semibold text-lg text-primary">CAPÍTULO III</h3>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mt-0.5">Procedimientos</p>
            </div>

            {/* ARTÍCULO OCTAVO */}
            <div className="space-y-6">
              <h4 className="font-bold text-primary text-base">ARTÍCULO OCTAVO: MECANISMOS DE PROTECCIÓN DEL TITULAR</h4>
              
              {/* 8.1 Consultas */}
              <div className="space-y-3 pl-4 border-l-2 border-secondary/30">
                <h5 className="font-bold text-primary text-sm">8.1. Consultas</h5>
                <p className="text-body-sm text-on-surface-variant">
                  La empresa dispondrá de mecanismos para que el Titular, sus causahabientes, sus representantes y/o apoderados, aquellos a quienes se ha estipulado a favor de otro o para otro, y/o los representantes de menores de edad Titulares, formulen consultas respecto de cuáles son los datos personales del Titular que reposan en las Bases de Datos de la empresa.
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Cualquiera que sea el medio, la empresa guardará prueba de la consulta y su respuesta.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-on-surface-variant">
                  <li><strong>a)</strong> Si el solicitante tuviere capacidad para formular la consulta, de conformidad con los criterios de acreditación establecidos en la Ley, la empresa recopilará toda la información sobre el Titular que esté contenida en el registro individual de esa persona o que esté vinculada con la identificación del Titular dentro de las bases de datos de la empresa y se la hará conocer al solicitante.</li>
                  <li><strong>b)</strong> El Responsable de atender la consulta dará respuesta al solicitante siempre y cuando tuviere derecho a ello por ser el Titular del Dato Personal, su causahabiente, apoderado, representante, se haya estipulado por otro o para otro, o sea el responsable legal en el caso de menores de edad. Esta respuesta se enviará dentro de los diez (10) días hábiles contados a partir de la fecha en la que la solicitud fue recibida por la empresa.</li>
                  <li><strong>c)</strong> En caso de que la solicitud no pueda ser atendida a los diez (10) días hábiles, se contactará al solicitante para comunicarle los motivos por los cuales el estado de su solicitud se encuentra en trámite. Para ello se utilizará el mismo medio o uno similar al que fue utilizado por el Titular para comunicar su solicitud.</li>
                  <li><strong>d)</strong> La respuesta definitiva a todas las solicitudes no tardará más de quince (15) días hábiles desde la fecha en la que la solicitud inicial fue recibida por la empresa.</li>
                </ul>
              </div>

              {/* 8.2 Reclamos */}
              <div className="space-y-3 pl-4 border-l-2 border-secondary/30">
                <h5 className="font-bold text-primary text-sm">8.2. Reclamos</h5>
                <p className="text-body-sm text-on-surface-variant">
                  La empresa dispone de mecanismos para que el Titular, sus causahabientes, representante y/o apoderados, aquellos que estipularon por otro o para otro, y/o los representantes de menores de edad Titulares, formulen reclamos respecto de (i) Datos personales Tratados por la empresa que deben ser objeto de corrección, actualización o supresión, o (ii) el presunto incumplimiento de los deberes de Ley de la empresa. El reclamo deberá ser presentado por el Titular, sus causahabientes o representantes o acreditados de conformidad con la Ley, así:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-on-surface-variant">
                  <li>Deberá dirigirse a la empresa por vía electrónica al correo electrónico oficial, o físicamente a la dirección dada por la empresa.</li>
                  <li>Deberá contener el nombre y documento de identificación del Titular.</li>
                  <li>Deberá contener una descripción de los hechos que dan lugar al reclamo y el objetivo perseguido (actualización, corrección o supresión, o cumplimiento de deberes).</li>
                  <li>Deberá indicar la dirección y datos de contacto e identificación del reclamante.</li>
                  <li>Deberá acompañarse por toda la documentación que el reclamante quiera hacer valer.</li>
                </ul>

                <div className="bg-surface-container-low p-4 rounded-xl space-y-2 mt-4 text-xs text-on-surface-variant">
                  <p>
                    <strong>8.2.1</strong> La empresa antes de atender el reclamo verificará la identidad del Titular del Dato Personal, su representante y/o apoderado, o la acreditación de que hubo una estipulación por otro o para otro. Para ello puede exigir la cédula de ciudadanía o documento de identificación original del Titular, y los poderes especiales, generales o documentos que se exijan según sea el caso.
                  </p>
                  <p>
                    <strong>8.2.2</strong> Si el reclamo o la documentación adicional están incompletos, la empresa requerirá al reclamante por una sola vez dentro de los cinco (5) días siguientes a la recepción del reclamo para que subsane las fallas. Si el reclamante no presenta la documentación e información requerida dentro de los dos (2) meses siguientes a la fecha del reclamo inicial, se entenderá que ha desistido del reclamo.
                  </p>
                  <p>
                    <strong>8.2.3</strong> Una vez recibido el reclamo con la documentación completa, se incluirá en la Base de Datos de la empresa donde reposen los Datos del Titular sujetos a reclamo una leyenda que diga “reclamo en trámite” y el motivo del mismo, en un término no mayor a dos (2) días hábiles. Esta leyenda deberá mantenerse hasta que el reclamo sea decidido.
                  </p>
                  <p>
                    <strong>8.2.4</strong> El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo. Cuando no fuere posible atender el reclamo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá su reclamo, la cual en ningún caso podrá superar los ocho (8) días hábiles siguientes al vencimiento del primer término.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <hr className="border-outline-variant/30" />

          {/* VIGENCIA */}
          <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-primary text-base">VIGENCIA</h4>
              <p className="text-body-sm text-on-surface-variant">
                Los datos permanecerán almacenados bajo criterios de temporalidad y necesidad.
              </p>
            </div>
            <div className="bg-secondary text-on-secondary px-4 py-2 rounded-xl text-sm font-bold">
              Rige a partir del 1 de julio de 2017
            </div>
          </div>

        </div>

        {/* Botón de Retorno */}
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-bold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver a la Página Principal
          </Link>
        </div>

      </div>
    </div>
  )
}
