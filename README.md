# Über diese Bibliothek

Dies ist eine Open-Source Bibliothek, die eine Auswahl von interaktiven MSK-Items für den DIPF ItemBuilder als "external pageframes" (Einbettung in iframes) zur Verfügung stellt.

<br>(Projektvorstellung)
<br>

Ziel der Entwicklung war nicht nur die Umsetzung der konkreten Items, sondern die Schaffung einer Bibliothek, die sich möglichst flexibel durch Konfigurationen an die genaue Ausgestaltung von ähnlichen Items dieser Art anpassen lässt. Der hier veröffentlichte Quelltext ist Ergebnis eines Prozesses mit mehrfachen Änderungen der Anforderungen, was im Ergebnis hier und da zu ggf. umständlicheren Umsetzungen führte. Der Stand kann als "Snapshot" der aktuellen Arbeit gesehen werden, keinesfalls als abgeschlossenes Produkt. So ist z.B. zum Zeitpunkt der Veröffentlichung das Applet `ruler` nicht fertiggestellt, da es im Rahmen des Projektes nicht zum Einsatz kommen sollte.


# Lizenz

Dieses Projekt wird unter der MIT-Lizenz (s. [LICENSE](LICENSE)) veröffentlicht.

# Eigenständige Bibliotheken

Die Bibliothek und die damit umgesetzten Items sind für den Einsatz innerhalb des DIPF ItemBuilders konzipiert. Jedes Item ist dabei ein getrenntes webpack-Projekt, für das unter Nutzung der Bibliothek jeweils eine HTML-Datei, eine JS-Datei sowie ggf. mehrere Zusatz-Dateien erzeugt werden. Jede HTML-Datei wird jeweils als ein "external pageframe" im ItemBuilder definiert und in einem &lt;iframe&gt; geladen.

Darüber hinaus kann eine eigenständige Bibliothek erzeugt werden, die auch außerhalb der ItemBuilder Umgebung eingesetzt werden kann. Bei Nutzung mehrerer Items wird jedoch trotzdem die Kapselung in separate iframes empfohlen. Nur diese Form der Einbindung ist hinreichend getestet.

In der Voreinstellung werden dabei zwei Bibliotheken erzeugt: "**mskt.js**" mit den Text-Komponenten, sowie "**mskgr.js**" mit allen grafischen Komponenten. Welche Komponenten jeweils enthalten sind, kann durch Kommentierung der entsprechenden Zeilen in [lib/mskt.js](lib/mskt.js) bzw. [lib/mskgr.js](lib/mskgr.js) selektiert werden.

Die Target-Definitionen für Babel (und somit die unterstützten Browser) können im Objekt "**babel_loader**", Eintrag "**targets**" in [webpack.config.js](webpack.config.js) festgelegt werden.

Die Bibliotheken können danach durch

    npm install
    npm run build

erzeugt werden. Die Ergebnisse werden im Verzeichnis "**./dist/**" gespeichert.


# Grundsätzliche Einbindung

Mit den vorliegenden Einstellungen werden UMD- (Universal Module Definition) Bibliotheken erzeugt, die sowohl als Module (Browser und NodeJS) genutzt als auch per &lt;script&gt;-Tag direkt im Browser geladen werden können.

Die verschiedenen Funktionalitäten (Applets) sind als Javascript-classes definiert. Jedes Applet benötigt eine Instanz einer `baseInits`-class, die grundsätzliche Funktionalitäten zu Verfügung stellt und vorher erstellt werden muss. Bei Instanziierung einer Applet-class wird ein Config-Objekt übergeben, das Anpassungen des Erscheinungsbildes sowie Definitionen von Elementen enthalten kann. Das Config-Objekt überschreibt mit Deep-Merge die Default-Definitionen des jeweiligen Applets. Die möglichen Definitionen und deren Bedeutungen können dem entsprechenden Quelltext der Applet-class entnommen werden.
```` javascript
    const base = new baseInits({
        ...optionen
    });
    const applet = new <appletClass>({
        option1: value1,
        option2: {
            suboption1: value, ...
        }, ...
    })
````

Die Stelle, an der ein Applet eingebunden wird, wird durch ein "Container"-Element im DOM vorgegeben. Die ID dieses Elements muss `baseInits` (bzw. einigen Applets ein Selektor direkt) bei Initiierung übergeben werden.

Ein einfaches Beispiel für das Laden der Bibliothek mit &lt;script&gt;-Tag und die Verwendung des `textareaInserts`-Applets ist in [test_mskt.html](test_mskt.html) enthalten. Das `textareaInserts`-Applet verlangt bei Initiierung den Selektor des Container-Elements als Parameter:
```` html
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="dist/mskt.css">
        <script src="dist/mskt.js"></script>
    </head>
    <body>

        <div id="container"></div>
        <script>

            function init () {

                const base = new mskt.baseInits();
                const ti = new mskt.textareaInserts( '#container', {

                    divStyles: {
                        width: `${window.innerWidth/2}px`,
                        height: `${window.innerHeight/2}px`,
                    },

                    toolbar: mskt.toolbarMathOperatorsFraction,

                }, base );
            }

            window.addEventListener( 'DOMContentLoaded', init );
        </script>
    </body>
</html>
````

Ein einfaches Beispiel für das Laden der Bibliothek mit &lt;script&gt;-Tag und die Verwendung des `barSlider`-Applets ist in [test_mskgr.html](test_mskgr.html) enthalten. Bei grafischen Applets muss die ID des Containers bei Initiierung der `baseInits`-class als Option übergeben werden:
```` html
<html>
    <head>
        <meta charset="utf-8" />
        <script src="dist/mskgr.js"></script>
    </head>
    <body>

        <div id="container"></div>
        <script>

            function init () {

                const base = new mskgr.baseInits({
                    container: 'container',
                });

                const width = 250;
                const height = 20;
                const sliderHeight = 40;

                const slider = new mskgr.barSlider( base, {

                    x: 30, y: 30,
                    width, height,
                    sliderHeight,
                    labels: [
                        { val: 0, text: '0 %', },
                        { val: 1, text: '100 %', },
                    ],
                } );
            }

            window.addEventListener( 'DOMContentLoaded', init );
        </script>
    </body>
</html>
````

# Kommunikation mit dem DIPF-ItemBuilder

Die Kommunikation mit dem DIPF-ItemBuilder erfolgt mittels `postMessage()`-Funktionen. Diese Funktionalität wird in **fsm.js** definiert.

In **baseInits.js** sind dafür einige Wrapper-Funktionen definiert, die den aktuellen 'Geändert-Status' sowie das Scoring verwalten.

Soll die Bibliothek außerhalb des ItemBuilders Verwendung finden, müssen ggf. diese beiden Dateien angepasst werden.

## Speichern und Laden des Zustandes

Um dem ItemBuilder das Laden und Speichern des aktuellen Zustands eines Applets zu ermöglichen, definiert jedes Applet die Funktionen `getState()` und `setState(state)`, die den aktuellen Zustand eines Applets als JSON-String zur Verfügung stellen bzw. einen früher gespeicherten Zustand durch Übergabe wieder herstellen können. Diese im Applet definierten Funktionen müssen im ItemBuilder-Kontext global im `window`-Objekt definiert werden.
```` javascript
    const io = new mskgr.numberLineWithArcs({
        ...optionen
    });

    window.getState = io.getState.bind(io);
    window.setState = io.setState.bind(io);
````

Bei Nutzung der Bibliothek außerhalb des ItemBuilders können diese Funktionen beliebig aufgerufen und die JSON-Zustands-Daten beliebig gespeichert werden.

## Ermittlung und Speicherung des Geändert-Status

Der 'Geändert-Status', also die Information, ob der User mit dem Applet interagiert bzw. eine Änderung des Status oder eine Eingabe vorgenommen hat, wird dem ItemBuilder durch Setzen einer oder mehrerer **State-Variablen** mitgeteilt. Zur Ermittlung dieser Status-Werte kann eine Objekt-Methode `statusVarDef()` definiert werden, die ein Objekt oder einen skalaren Wert zurückliefert. Wird ein Objekt zurückgegeben, werden die Keys des Objekts als Variablennamen und die Werte als deren Werte an den ItemBuilder gesendet. Wenn statt eines Objektes ein skalarer Wert zurückgegeben wird und die Eigenschaft `this.FSMVariableName` gesetzt ist, wird als Variablenname `"V_Status_${this.FSMVariableName}"` verwendet.

Auch ohne Definition von `statusVarDef()` senden die meisten Applets einen Default-Change-Status. Hierfür wird die Methode `getDefaultChangeState()` aufgerufen, die ebenfalls Objekte (die Keys werden zu Variablennamen) oder einen skalaren Wert (als Variablenname wird `"V_Status_${this.FSMVariableName}"` verwendet) zurückliefern kann, wobei skalare Werte immer in Number-Werte 0|1 konvertiert werden. Die meisten Applets definieren dazu eine weitere Methode `getChState()`, die einen verkürzten State zurückliefert, der keine Darstellungsoptionen, sondern nur den Zustand derjenigen Elemente beinhaltet, deren Änderung durch den User als 'Geändert-Status' bemerkt werden sollen. Hierzu wird bei den meisten Applets die Rückgabe von `getChState()` direkt nach der Initialisierung in `this.initData` gespeichert und beim Aufruf von `getDefaultChangeState()` die aktuelle Rückgabe von `getChState()` mit der in `this.initData` Version verglichen. Diese Default-Umsetzung gibt nur false|true zurück, setzt also nur bei Definition von `this.FSMVariableName` einen Status von 0 oder 1.

Beispiel 1:
```` javascript
    const applet = new mskgr.stampImages({
        ...optionen,

        FSMVariableName: 'item_465',
    })
````

Beispiel 2:
```` javascript
    const applet = new mskgr.stampImages({
        ...optionen,

        statusVarDef (): {
            const statname = 'V_State_item5';

            return {
                'V_bogen_gezogen': (Bedingung 1),
                'V_eingabe_vorgenommen': (Bedingung 2),
                [statname]: (Gesamt-Bedingung)
            };
        }
    })
````

Im **Beispiel 1** wird die Variable `V_Status_item_465` auf 0 oder 1 gesetzt, in **Beispiel 2** werden die Variablen `V_bogen_gezogen`, `V_eingabe_vorgenommen` und `V_State_item5` auf die entsprechenden Werte gesetzt.

Ein Übermittlung an den ItemBuilder erfolgt in jedem Fall nur bei Änderung eines (Teil-)Wertes.


## Mögliches Scoring

Die Applets können ein Scoring enthalten, im Sinne einer Bewertung des aktuellen Zustand, das als eine oder mehrere Variablen an den ItemBuilder gesendet wird. Dazu muss eine Objekt-Methode `scoreDef()` definiert werden, die ein Objekt oder einen skalaren Wert zurückliefert. Wird ein Objekt zurückgegeben, werden die Keys des Objekts als Variablennamen und die Werte als deren Werte an den ItemBuilder gesendet. Wird statt eines Objektes ein skalarer Wert zurückgegeben, wird als Variablenname entweder die Applet-Eigenschaft `this.scoreVariableName` oder `"V_Score_${this.FSMVariableName}"` verwendet.

Beispiel 1:
```` javascript
    const applet = new mskgr.stampImages({
        ...optionen,

        FSMVariableName: '3_a_4',

        scoreDef (): {
            (mögliche Berechnungen)

            return (Bedingung 1);
        }
    })
````

Beispiel 2:
```` javascript
    const applet = new mskgr.stampImages({
        ...optionen,

        scoreDef (): {
            (mögliche Berechnungen)
            let ergname = "test1";

            return {
                'input1': (abgeleiteter Wert 1),
                'input2': (abgeleiteter Wert 2),
                [ergname]: (Bedingung 1)
            };
        }
    })
````

In **Beispiel 1** wird die Variable `V_Score_3_a_4` mit dem Wert der Bedingung an den ItemBuilder gesendet, im **Beispiel 2** werden die Variablen `input1`, `input2` sowie die Variable `test1` mit den berechneten Werten gesetzt.

Ein Übermittlung an den ItemBuilder erfolgt in jedem Fall nur bei Änderung eines Scoring-(Teil-)Wertes.

## Logs der Useraktivitäten

Die Applets loggen bestimmte User-Aktivitäten mittels Aufruf von `baseInits.postLog()`, welche durch `fsm.postLogEvent()` als **traceMessage** an den ItemBuilder gesendet werden. Eine Übersicht über die möglichen Events der verschiedenen Applets und die jeweils gesendeten Daten gibt die Datei [logEvents_list.ods](logEvents_list).

Jedes Applet vergibt für mehrfach verwendete Elemente, die selbst Logs erzeugen (z.B. mehrere Input-Textfelder in einer Grafik), automatisch fortlaufende IDs. Wenn mehrere Applets in einem &lt;iframe&gt; bzw. auf einer Seite verwendet werden, kann für jedes Applet eine eigene "globale" `logObjectId` gesetzt werden (s. Beispiel im Abschnitt "Mehrere Applets in einem iframe").


# Demo Animation

Um Usern die Bedienung der Applets vorstellen zu können, gibt es die Möglichkeit, direkt nach Laden eines Applets eine Animation abzuspielen, in der grundlegende Bedienungsschritte als eine Art Video demonstriert werden können. Dabei wird jedoch kein Video abgespielt, sondern es werden Events (Useraktionen) simuliert und das Applet reagiert darauf, als würden diese Aktionen von einem User durchgeführt. Während der Animation können verschiedene Cursor dargestellt werden, um z.B. "**klicken**" oder "**geklickt halten**" zu symbolisieren.<br>
Derartige Animationen stoppen nach einer definierten Anzahl von Durchläufen bzw. bei der ersten echten Useraktion.

Definiert werden diese Animationen durch Initiierung der `demoAni`-Klasse. In den **Optionen** dieser Klasse müssen u.a. die darzustellenden Cursor und ein einfaches Skript, das die verschiedenen Aktionen, deren Dauer und ggf. Pausen definiert, übergeben werden. Um den Status des Applets speichern und laden zu können, müssen darüber hinaus die zu verwendenden `get/setState()` Funktionen des Applets angegeben werden.<br>
Die im Animations-Skript verwendeten Koordinaten können entweder absolute Koordination der Canvas-Grafik sein oder "**skalierte**" Werte. Bei letzteren muss den Koordinatenwerten ein `'s'` folgen und es müssen die Methoden `val2x` und `val2y` definiert sein, die diese Skalenwerte in absolute Koordinaten umrechnen. So ist es z.B. sehr einfach möglich, die Werte eines dargestellten Zahlenstrahles als Koordinaten zu verwenden:
```` javascript
    const base = new baseInits( { ... } );

    const io = new numberLineWithArcs( base, {
        ...optionen
    });

    const ani = new demoAni( base.stage, {
        repeats: 2,
        beginDelay: 300,

        val2x: io.numberLine.val2x.bind(io.numberLine),
        val2y: (ys) => io.numberLine.y+ys,
        getState: io.getState.bind(io),
        setState: io.setState.bind(io),

        cursor: {
            demo: { cursor: demo_cursor, cursorOfX: 8, cursorOfY: 3, },
            demo_click: { cursor: demo_cursor_click, cursorOfX: 21, cursorOfY: 18, }
        },

        ani: [
            { act:'moveLin', x: '3.47s', y: '0s',  duration:400, pause:200, cursor:'demo', },
            { event:'mousedown',                                 pause:400, cursor:'demo_click', },
            { event:'mouseup',                                   pause:0,   cursor:'demo', },
            { act:'moveLin', x: '3.47s', y: '60s', duration:400, pause:200, cursor:'demo', },
            {                                                    pause:400, cursor:'demo_click', },
            { event:'click',                                     pause:400, },
            { textInput:'1',                                     pause:150, },
            { textInput:'2',                                     pause:150, },
            { textInput:',',                                     pause:150, },
            { textInput:'3',                                     pause:150, },
            { textInput:'4',                                     pause:150, },
            { act:'moveLin', x: '3.55s', y: '60s', duration:200, pause:200, cursor:'demo', },
            { event:'click',                                     pause:200, cursor:'demo_click', },
            {                                                    pause:300, cursor:'demo', },
            ...
        ],
    });
````

In einigen **examples** sind weitere Beispiele enthalten.


# Mehrere Applets in einem iframe

Es ist möglich, mehrere nicht überlappende Applets in einem Container anzuordnen. Dabei wird nur eine Instanz einer `baseInits`-class benötigt.

Soll eine solche Anordnung im DIPF-ItemBuilder verwendet werden, müssen globale `get/setState()` Funktionen definiert werden, die einen Gesamt-State der Einzel-States aller Applets zurückliefern bzw. die Einzel-States aller Applets aus einem Gesamt-State setzen. Folgendes Beispiel verdeutlicht das:
```` javascript
    const base = new mskgr.baseInits({
        container: 'container',
    });

    const width = 250, height = 20, sliderHeight = 40;

    const slider1 = new mskgr.barSlider( base, {
        x: 30, y: 30,
        width, height,
        sliderHeight,
        logObjectId: 100,
    } );

    const slider2 = new mskgr.barSlider( base, {
        x: 30, y: 80,
        width, height,
        sliderHeight,
        logObjectId: 200,
    } );

    window.getState = function () {
        return JSON.stringify({
            s1: JSON.parse( slider1.getState() ),
            s2: JSON.parse( slider2.getState() ),
        })
    }

    window.setState = function (state) {
        try {
            const o = JSON.parse(state);
            slider1.setState( o.s1 );
            slider2.setState( o.s2 );
        } catch (e) {
            console.error(e);
        }
    }
````

Es ist auch möglich, mehrere Container und mehrere `baseInits`-Instanzen in einem &lt;iframe&gt; zu verwenden. So benötigt z.B. jede `textAreaInserts`-Instanz einen eigenen Container. Sollen mehrere `baseInits`-Instanzen in einem &lt;iframe&gt; im ItemBuilder verwendet werden, muss sichergestellt sein, dass pro &lt;iframe&gt; nur eine `fsm`-Instanz exitiert, die normalerweise im Constructor der `baseInits`-Class automatisch initiiert werden. Dies ist durch Übergabe der ersten `fsm`-Instanz bei Initiierung der weiteren `baseInits`-Classes möglich:
```` javascript
    const base1 = new baseInits({
        container: "cont1"
    });

    const gr1 = new mskgr.inputGrid({
        logObjectId: 1,
        ...optionen
    });

    const base2 = new baseInits({
        container: "cont2",
        fsm: base1.fsm   // nutze bestehende fsm Instanz
    })

    const gr2 = new pointArea({
        logObjectId: 2,
        ...optionen
    })
````

In den Beispielen werden jeweils auch unterschiedliche `logObjectId` gesetzt, damit die zu den User-Aktivitäten erzeugten Log-Events zugeordnet werden können.


# Beispiele

Das Unterverzeichnis `examples` enthält einige Beispiele. Zu deren Erzeugung wurde eine separate webpack-Config Datei erstellt. Durch
```` shell
    npm run examples
````
werden die Beispiel-Dateien erzeugt und im Unterverzeichnisse `examples/dist` gespeichert. Die Datei `overview.html` gibt einen Überblick über alle Dateien. Jedes Beispiel lässt sich durch Anklicken des Dateinamens separat in einem Extra-Fenster öffnen. Die Developer-Konsole zeigt die an den ItemBuilder gesendeten Nachrichten an.

Alle Beispiele sind Items aus dem Projekt. Manche haben separate Ausgangs-Quelltexte, manche nutzen Templates ("tmp*"-Dateien), die mit Hilfe von [ifdef-loader](https://www.npmjs.com/package/ifdef-loader) und [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) an die jeweiligen Items angepasst werden. Die Daten hierzu sind in `itemData.js` enthalten, diese werden zur Erstellung der webpack-Config sowie overview.html genutzt.

Einige Beispiele enthalten eine Start-Animation (`demoAni`). Diese ist auf der Übersichtsseite deaktiviert und wird nur bei Einzelansicht angezeigt.

# Kontakt

## DIPF Projekt

## Autor

blauwaldt.it UG (haftungbeschränkt)<br>
Marc A. Müller<br>
mmueller (at) blauwaldt.it
