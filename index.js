const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises
let mensagem = "";

let metas 

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Você não possue metas definidas!"
        return
    }
    const respotas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar/desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })
    
    metas.forEach((m) => {
        m.checked = false
    })

    if(respotas.length == 0) {
        mensagem = "Nenhuma meta foi selecionada!"
        return
    }

    respotas.forEach((respota) => {
        const meta = metas.find((m) => {
            return m.value == respota
        })

        meta.checked = true

    })
    mensagem = "Meta(s) marcada(s) como concluída(s)!"
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return

    }

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "Você não possue metas definidas!"
        return
    }

    const realizadas = metas.filter ((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0) {
        mensagem = "Não existem metas realizadas :(."
    return
    }
    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Você não possue metas definidas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas :)."
        return
    }
    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const removerMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Você não possue metas definidas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

const itensADeletar = await checkbox({
    message: "Selecione a meta que deseja remover.",
    choices: [...metasDesmarcadas],
    instructions: false,
})

if(itensADeletar.length == 0) {
    mensagem = "Nenhuma meta foi removida."
    return
}

itensADeletar.forEach ((item) => {
metas = metas.filter((meta) => {
return meta.value != item
})
})
mensagem = "Meta(s) removida(s) com sucesso!."
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()

    while(true) {
        mostrarMensagem()
        await salvarMetas()
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar metas",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"

                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"

                },
                {
                    name: "Metas abertas",
                    value: "abertas"

                },
                {
                    name: "Remover metas",
                    value: "remover"

                },
                {
                    name: "Sair",
                    value: "sair"
                
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break     
            case "realizadas":
                await metasRealizadas()
                break
                case "abertas":
                await metasAbertas()
                break
            case "remover":
                await removerMetas()
                break
            case "sair":
                console.log("Até a próxima!")
                return
            
        }
    }

}

start()