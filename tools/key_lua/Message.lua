module("Message", package.seeall)

slot0 = {
	__newindex = function (slot0, slot1, slot2)
		if string.len(slot1) >= 3 and string.sub(slot1, -1, -3) == "tos" then
			for slot7 = 1, #slot0.proto do
				if slot3[slot7][1] == slot1 then
					rawset(slot0, slot1, slot2)

					return
				end
			end

			error("proto: " .. slot0.classname .. "  set wrong value:" .. slot1)
		else
			rawset(slot0, slot1, slot2)
		end
	end
}

function createProto(slot0)
	if Net[slot0] == nil then
		print(" -------------->>>> Net[name]" .. debug.traceback())
		error("Connection.createProto error,wrong classname:" .. slot0)
	end

	slot1 = {
		classname = slot0,
		proto = Net[slot0]
	}

	setmetatable(slot1, uv0)

	return slot1
end

encryptHandler = nil
isEncrypt = false

function setEncrypt(slot0)
	if isEncrypt == false then
		encryptHandler = slot0
		isEncrypt = true
	end
end

function encode(slot0)
	slot1 = ByteArray()

	slot1:WriteByte(131)
	pack(slot0, slot1, ProtoAlias.getAliasByClassName(slot0.classname))

	if isEncrypt == false then
		return slot1
	end

	if encryptHandler ~= null then
		return encryptHandler(slot1)
	end

	return slot1
end

function pack(slot0, slot1, slot2)
	if slot0 == nil then
		slot1:WriteByte(100)
		slot1:WriteUtf("undefined")

		return slot1
	end

	slot5 = 0
	slot6 = 0
	slot7 = 0
	slot8, slot9 = nil

	if #slot0.proto > 255 then
		slot1:WriteByte(105)
		slot1:WriteInt(slot4 + 1)
	else
		slot1:WriteByte(104)
		slot1:WriteByte(slot4 + 1)
	end

	if slot2 > 0 then
		slot1:WriteByte(98)
		slot1:WriteInt(slot2)
	else
		slot1:WriteByte(100)
		slot1:WriteUtf(ProtoAlias:getAliasByClassName(slot2))
	end

	for slot13 = 1, slot4 do
		if string.lower(slot3[slot13][2]) == "int" then
			slot1:WriteByte(98)
			slot1:WriteInt(slot0[slot3[slot13][1]])
		elseif slot8 == "long" then
			slot1:WriteByte(110)
			slot1:WriteLong(slot9)
		elseif slot8 == "number" then
			slot1:WriteByte(98)
			slot1:WriteInt(slot9)
		elseif slot8 == "String" or slot8 == "string" then
			slot1:WriteByte(107)
			slot1:WriteUtf(slot9)
		elseif slot8 == "bool" or slot8 == "boolean" then
			slot1:WriteByte(100)

			if slot9 == true then
				slot1:WriteUtf("true")
			else
				slot1:WriteUtf("false")
			end
		elseif slot8 == "array" then
			if slot9 ~= nil and #slot9 > 0 then
				slot1:WriteByte(108)
				slot1:WriteUnsignedInt(slot5)

				for slot18 = 1, slot5 do
					if string.lower(slot3[slot13][3]) == "int" then
						slot1:WriteByte(98)
						slot1:WriteInt(slot9[slot18])
					elseif slot14 == "long" then
						slot1:WriteByte(110)
						slot1:WriteLong(slot9[slot18])
					elseif slot14 == "number" then
						slot1:WriteByte(98)
						slot1:WriteInt(slot9[slot18])
					elseif slot14 == "String" or slot14 == "string" then
						slot1:WriteByte(107)
						slot1:WriteUtf(slot9[slot18])
					elseif slot14 == "bool" or slot14 == "Boolean" then
						slot1:WriteByte(100)

						if slot9[slot18] == true then
							slot1:WriteUtf("true")
						else
							slot1:WriteUtf("false")
						end
					else
						pack(slot9[slot18], slot1, ProtoAlias.getAliasByClassName(slot14))
					end
				end
			end

			slot1:WriteByte(106)
		elseif slot8 == "bytes" then
			slot1:WriteByte(109)
			slot1:WriteInt(#slot9)
			slot1:WriteUtf(slot9)
		else
			pack(slot9, slot1, ProtoAlias.getAliasByClassName(slot9.classname))
		end
	end

	return slot1
end

slot1, slot2 = nil

function decode(slot0, slot1)
	uv0 = slot0
	uv1 = slot1
	uv0 = nil

	return decodeVO(slot0, slot1)
end

slot3 = " "

function decodeVO(slot0, slot1)
	uv0 = slot1
	slot2 = {}
	slot6 = 0

	for slot10 = 1, #createProto(slot1).proto do
		slot11 = slot4[slot10]

		xpcall(function ()
			uv0[uv1[1]] = decodeOther(uv2, uv1[2], uv1[3])
		end, function (slot0)
			slot1 = "跳过打印：此包的报错信息已经打印过"

			if uv0 then
				slot5 = uv0.Length

				for slot5 = 0, uv0.Length - 1 do
					slot1 = "所属的错误包名：" .. uv1 .. "  包总长度：" .. slot5 .. "\n" .. uv0.Buffer[slot5] .. ","
				end
			end

			uv0 = nil

			printError("解码报错: " .. uv2 .. "详细信息->\n" .. slot1 .. "\n" .. slot0)
		end)
	end

	return slot3
end

function decodeOther(slot0, slot1, slot2)
	slot3 = 0
	slot5 = nil

	if slot0:ReadUnsignedByte() == 97 then
		return slot0:ReadUnsignedByte()
	elseif slot4 == 98 then
		return slot0:ReadInt()
	elseif slot4 == 99 then
		tmp = slot0:ReadUtfBytes(31)

		return tmp
	elseif slot4 == 115 then
		slot6 = ByteArray()

		slot6:ReadBytes(slot0.Buffer, slot0.Postion, slot0:ReadUnsignedByte())

		return slot6.ToString()
	elseif slot4 == 107 then
		if slot0:ReadUnsignedShort() > 0 then
			if slot1 == "String" or slot1 == "string" or slot2 == "String" or slot2 == "string" then
				return slot0:ReadUtfBytes(slot3)
			else
				for slot10 = 1, slot3 do
				end

				return {
					[slot10] = slot0:ReadUnsignedByte()
				}
			end
		end
	elseif slot4 == 108 then
		if slot0:ReadUnsignedInt() > 0 then
			slot6 = {}
			slot7 = nil

			for slot12 = 1, slot3 do
				if string.find(slot2, "p_") ~= nil == false then
					slot7 = decodeOther(slot0, slot1, slot2)
				else
					slot0:ReadUnsignedByte()
					slot0:ReadUnsignedByte()

					slot14 = nil

					if slot0:ReadUnsignedByte() == 97 then
						slot14 = slot0:ReadByte()
					elseif slot13 == 98 then
						slot14 = slot0:ReadInt()
					end

					if ProtoAlias.getAliasByClassName(slot14) == nil then
						print("at flag 108 -- >> " .. slot14 .. " test_classname -->> " .. uv0)
					end

					slot7 = decodeVO(slot0, slot15)
				end

				table.insert(slot6, slot7)
			end

			slot0:ReadByte()

			return slot6
		end
	elseif slot4 == 106 then
		if slot1 == "String" or slot1 == "string" then
			return ""
		end

		return {}
	elseif slot4 == 104 then
		return decodeObject(slot0)
	elseif slot4 == 105 then
		slot0:ReadInt()
		slot0:ReadUnsignedByte()

		if ProtoAlias.getAliasByClassName(slot0:ReadInt()) == nil then
			print("at flag 105 -- >> " .. slot6 .. " test_classname -->> " .. uv0)
		end

		return decodeVO(slot0, slot7)
	elseif slot4 == 100 then
		if slot1 == "Boolean" or slot1 == "bool" then
			return slot0:ReadUtf() == "true"
		end

		if slot0:ReadUtf() == "undefined" then
			return nil
		end

		return slot6
	elseif slot4 == 110 then
		return slot0:ReadLong(true)
	elseif slot4 == 111 then
		return slot0:ReadInt64(false)
	elseif slot4 == 109 then
		return slot0:ReadUtfBytes(slot0:ReadUnsignedInt())
	else
		error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 非法类型 " .. slot4 .. "请检查协议 " .. uv1)

		return nil
	end

	return nil
end

function decodeObject(slot0)
	slot0:ReadUnsignedByte()

	if ProtoAlias.getAliasByClassName(readIntValue(slot0:ReadUnsignedByte(), slot0)) == nil then
		return {
			slot2,
			readKeyValue(slot0)
		}
	else
		return decodeVO(slot0, slot3)
	end
end

function readIntValue(slot0, slot1)
	if slot0 == 97 then
		return slot1:ReadUnsignedByte()
	elseif slot0 == 98 then
		return slot1:ReadInt()
	else
		return 0
	end
end

function readKeyValue(slot0)
	if slot0:ReadUnsignedByte() > 100 then
		return readStringValue(slot1, slot0)
	else
		return readIntValue(slot1, slot0)
	end
end

function readStringValue(slot0, slot1)
	if slot0 == 107 then
		return slot1:ReadUtf()
	elseif slot0 == 106 then
		return ""
	elseif slot0 == 109 then
		return slot1:ReadUtfBytes(slot1:ReadUnsignedShort())
	else
		return ""
	end
end
